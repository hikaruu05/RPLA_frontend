import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  Modal,
  Alert 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';


const PDFFilePicker = ({ onFileSelect }) => {
  const [fileError, setFileError] = useState('');

  const selectPDFFile = async () => {
    try {
      setFileError(''); // Reset error state
      
      // Configure document picker options
      const options = {
        type: ['application/pdf'],
        copyToCacheDirectory: true, // This ensures the file is accessible
        multiple: false
      };
      
      // Launch document picker
      const result = await DocumentPicker.getDocumentAsync(options);
      
      console.log('Document picker result:', result); // Debugging log
      
      if (result.canceled) {
        console.log('User cancelled document picker');
        return;
      }

      // Get the selected asset
      const file = result.assets[0];
      
      // Validate file type
      if (!file.mimeType || !file.mimeType.toLowerCase().includes('pdf')) {
        setFileError('Hanya file PDF yang diperbolehkan');
        return;
      }

      // Get file info for size validation
      const fileInfo = await FileSystem.getInfoAsync(file.uri);
      console.log('File info:', fileInfo); // Debugging log

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (fileInfo.size > maxSize) {
        setFileError('Ukuran file tidak boleh lebih dari 10MB');
        return;
      }

      // If all validations pass, call the callback with file details
      onFileSelect({
        uri: file.uri,
        name: file.name,
        size: fileInfo.size,
        type: file.mimeType
      });

    } catch (error) {
      console.error('Error selecting PDF:', error);
      
      if (DocumentPicker.isCancel(error)) {
        console.log('User cancelled file picker');
        return;
      }
      
      setFileError('Gagal memilih file. Silakan coba lagi.');
    }
  };

  return (
    <View style={styles.filePickerContainer}>
      <TouchableOpacity 
        style={styles.selectFileButton} 
        onPress={selectPDFFile}
      >
        <Text style={styles.selectFileButtonText}>Pilih File PDF</Text>
      </TouchableOpacity>
      
      {fileError ? (
        <Text style={styles.errorText}>{fileError}</Text>
      ) : null}
    </View>
  );
};






// Updated PDFTemplateUploader using the new PDFFilePicker
const PDFTemplateUploader = ({ isVisible, onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [templateName, setTemplateName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (fileData) => {
    setSelectedFile(fileData);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      Alert.alert('Error', 'Silakan pilih file PDF terlebih dahulu');
      return;
    }

    if (!templateName.trim()) {
      Alert.alert('Error', 'Silakan masukkan nama template');
      return;
    }

    setIsUploading(true);
    
    try {
      // Read file as base64
      const fileContent = await FileSystem.readAsStringAsync(selectedFile.uri, {
        encoding: FileSystem.EncodingType.Base64
      });

      // Prepare upload data
      const uploadData = {
        name: templateName,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        fileContent: fileContent
      };

      // Call upload handler
      await onUpload(uploadData);

      // Reset form
      setSelectedFile(null);
      setTemplateName('');
      onClose();

    } catch (error) {
      console.error('Upload failed:', error);
      Alert.alert(
        'Upload Gagal', 
        'Terjadi kesalahan saat mengunggah file. Silakan coba lagi.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Buat Template PDF</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Nama Template"
            value={templateName}
            onChangeText={setTemplateName}
          />

          <PDFFilePicker onFileSelect={handleFileSelect} />

          {selectedFile && (
            <View style={styles.fileInfoContainer}>
              <Text style={styles.fileInfoText}>
                File: {selectedFile.name}
              </Text>
              <Text style={styles.fileInfoText}>
                Ukuran: {(selectedFile.size / 1024).toFixed(2)} KB
              </Text>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={onClose}
              disabled={isUploading}
            >
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.uploadButton, 
                (!selectedFile || !templateName || isUploading) && styles.uploadButtonDisabled
              ]}
              onPress={handleUpload}
              disabled={!selectedFile || !templateName || isUploading}
            >
              <Text style={styles.uploadButtonText}>
                {isUploading ? 'Mengunggah...' : 'Unggah Template'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};


// Login Screen
const LoginScreen = ({ onLogin, onRegister, onForgotPassword }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PrakEditor</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        
        <TouchableOpacity style={styles.rememberContainer}>
          <Text style={styles.rememberText}>Remember me?</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => onLogin(username, password)}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        
        <View style={styles.bottomTextContainer}>
          <TouchableOpacity onPress={onRegister}>
            <Text style={styles.bottomText}>Don't have an account? Register</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onForgotPassword}>
            <Text style={styles.bottomText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Registration Screen
const RegisterScreen = ({ onRegister, onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [selectedRole, setSelectedRole] = useState('user');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PrakEditor</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Register as:</Text>
          <Picker
            selectedValue={selectedRole}
            onValueChange={(itemValue) => setSelectedRole(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="User" value="user" />
            <Picker.Item label="Admin" value="admin" />
          </Picker>
        </View>
        
        <View style={styles.termsContainer}>
          <TouchableOpacity 
            onPress={() => setAgreedToTerms(!agreedToTerms)}
            style={styles.checkboxContainer}
          >
            <View style={[
              styles.checkbox, 
              agreedToTerms && styles.checkboxChecked
            ]} />
            <Text style={styles.termsText}>I agree with the terms & conditions</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => onRegister(email, username, password, agreedToTerms, selectedRole)}
        >
          <Text style={styles.loginButtonText}>Register</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={onBackToLogin}>
          <Text style={styles.bottomText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Dashboard Screen
const DashboardScreen = ({ username, role, onLogout }) => {
  const [isTemplateModalVisible, setIsTemplateModalVisible] = useState(false);
  const dashboardTitle = role === 'admin' ? 'Anda Adalah Admin' : 'Anda Adalah User';

  const handleTemplateUpload = (templateData) => {
    
    // Implementasi logika unggahan template
    console.log('Template uploaded:', templateData);
    Alert.alert(
      'Template Upload', 
      `Template "${templateData.name}" uploaded successfully`
    );
  };

  return (
    <SafeAreaView style={styles.dashboardContainer}>
      <View style={styles.dashboardHeader}>
        <Text style={styles.dashboardTitle}>PrakEditor</Text>
        <Text style={styles.dashboardSubtitle}>{dashboardTitle}</Text>
        <View style={styles.userSection}>
          <View>
            <Text style={styles.welcomeText}>Halo, </Text>
            <Text style={styles.usernameText}>@{username}</Text>
          </View>
          <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.dashboardContent}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Projects</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Upload</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.projectList}>
            <Text style={styles.projectItem}>1. Prak_tbd</Text>
          </View>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Templates</Text>
          {role === 'admin' && (
            <TouchableOpacity 
              style={styles.createProjectButton}
              onPress={() => setIsTemplateModalVisible(true)}
            >
              <Text style={styles.createProjectButtonText}>Buat Template</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.createProjectButton}>
            <Text style={styles.createProjectButtonText}>Buat Project</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <PDFTemplateUploader
        isVisible={isTemplateModalVisible}
        onClose={() => setIsTemplateModalVisible(false)}
        onUpload={handleTemplateUpload}
      />
    </SafeAreaView>
  );
};

// Main App Component
export default function App() {
  const [screen, setScreen] = useState('login');
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState('user');

  const handleLogin = (user, pass) => {
    // Simple login logic
    if (user && pass) {
      setUsername(user);
      setScreen('Anda Adalah');
    }
  };

  const handleRegister = (email, user, pass, agreedToTerms, role) => {
    // Simple registration logic
    if (email && user && pass && agreedToTerms) {
      setUsername(user);
      setUserRole(role);
      setScreen('Anda Adalah');
    }
  };

  const handleLogout = () => {
    setScreen('login');
    setUsername('');
    setUserRole('user');
  };

  return (
    <>
      {screen === 'login' && (
        <LoginScreen 
          onLogin={handleLogin}
          onRegister={() => setScreen('register')}
          onForgotPassword={() => {/* Implement forgot password logic */}}
        />
      )}
      
      {screen === 'register' && (
        <RegisterScreen 
          onRegister={handleRegister}
          onBackToLogin={() => setScreen('login')}
        />
      )}
      
      {screen === 'Anda Adalah' && (
        <DashboardScreen 
          username={username}
          role={userRole}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}


// Styles (unchanged from previous code)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputContainer: {
    width: '100%',
    maxWidth: 350,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  bottomTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  bottomText: {
    color: '#007bff',
  },
  rememberContainer: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  termsContainer: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#007bff',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#007bff',
  },
  dashboardContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  dashboardHeader: {
    backgroundColor: '#007bff',
    padding: 20,
  },
  dashboardTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  dashboardSubtitle: {
    color: 'white',
    fontSize: 16,
    marginTop: 5,
  },
  userSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  welcomeText: {
    color: 'white',
    fontSize: 16,
  },
  usernameText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#007bff',
  },
  dashboardContent: {
    padding: 20,
  },
  sectionContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  actionButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  projectList: {
    marginTop: 10,
  },
  projectItem: {
    fontSize: 16,
    color: '#333',
  },
  createProjectButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
  },
  createProjectButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  uploadButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});