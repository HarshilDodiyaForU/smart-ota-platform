import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:url_launcher/url_launcher.dart';
import 'dart:convert';

class OtaScreen extends StatefulWidget {
  const OtaScreen({super.key});

  @override
  _OtaScreenState createState() => _OtaScreenState();
}

class _OtaScreenState extends State<OtaScreen> {
  bool _isLoading = false;
  Map<String, dynamic>? _otaData;
  static const String currentVersion = "1.0.0";

  bool _isVersionNewer(String serverVersion) {
    try {
      final serverParts = serverVersion.split('.').map(int.parse).toList();
      final currentParts = currentVersion.split('.').map(int.parse).toList();

      for (int i = 0; i < 3; i++) {
        final server = i < serverParts.length ? serverParts[i] : 0;
        final current = i < currentParts.length ? currentParts[i] : 0;
        if (server > current) return true;
        if (server < current) return false;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  Future<void> _checkOtaUpdate() async {
    setState(() {
      _isLoading = true;
    });
    try {
      final response = await http.get(Uri.parse('http://localhost:8081/ota'));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final serverVersion = data['version']?.toString() ?? '';

        if (_isVersionNewer(serverVersion)) {
          setState(() {
            _otaData = data;
            _isLoading = false;
          });
          _showOtaDialog();
        } else {
          setState(() {
            _isLoading = false;
          });
          _showErrorDialog(
            'No update available. Current version: $currentVersion, Server version: $serverVersion',
          );
        }
      } else {
        setState(() {
          _isLoading = false;
        });
        _showErrorDialog('Failed to check OTA: ${response.statusCode}');
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      _showErrorDialog('Error checking OTA: $e');
    }
  }

  Future<void> _launchDownloadUrl(String? url) async {
    if (url == null || url.isEmpty) {
      return;
    }
    final uri = Uri.parse(url);
    final launched = await launchUrl(uri, mode: LaunchMode.externalApplication);
    if (!launched && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Could not open download link')),
      );
    }
  }

  void _showOtaDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('OTA Update'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Status: ${_otaData!['status']}'),
            const SizedBox(height: 8),
            Text('Version: ${_otaData!['version']}'),
            const SizedBox(height: 8),
            GestureDetector(
              onTap: () =>
                  _launchDownloadUrl(_otaData!['downloadUrl']?.toString()),
              child: Text(
                'Download: ${_otaData!['downloadUrl']}',
                style: const TextStyle(
                  color: Colors.blue,
                  decoration: TextDecoration.underline,
                ),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  void _showErrorDialog(String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Error'),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Smart OTA Platform'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (_isLoading)
              const Column(
                children: [
                  CircularProgressIndicator(),
                  SizedBox(height: 16),
                  Text('Checking for updates...'),
                ],
              )
            else
              ElevatedButton(
                onPressed: _checkOtaUpdate,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 32,
                    vertical: 16,
                  ),
                ),
                child: const Text('Check OTA Update'),
              ),
          ],
        ),
      ),
    );
  }
}
