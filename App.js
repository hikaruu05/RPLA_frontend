import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity, FlatList } from 'react-native';
import { useState } from 'react';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User'); 
  const [loggedInRole, setLoggedInRole] = useState('');

  const handleRegister = () => {
    if (username.trim() === '' || password.trim() === '' || role.trim() === '') {
      alert('Semua kolom harus diisi!');
      return;
    }
    console.log('Registered Username:', username);
    console.log('Registered Password:', password);
    console.log('Registered Role:', role);
    setShowRegister(false);
  };

  const handleLogin = () => {
    if (username.trim() === '' || password.trim() === '') {
      alert('Username dan password tidak boleh kosong!');
      return;
    }
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('Role:', role);
    setLoggedInRole(role);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setLoggedInRole('');
  };

  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        loggedInRole === 'Admin' ? (
          <AdminDashboard onLogout={handleLogout} />
        ) : (
          <UserDashboard onLogout={handleLogout} />
        )
      ) : showRegister ? (
        <Register
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          role={role}
          setRole={setRole}
          onRegister={handleRegister}
        />
      ) : (
        <Login
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          onLogin={handleLogin}
          onShowRegister={() => setShowRegister(true)}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const Register = ({ username, setUsername, password, setPassword, role, setRole, onRegister }) => {
  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Role (User/Admin)"
        value={role}
        onChangeText={setRole}
      />
      <Button title="Register" onPress={onRegister} />
    </View>
  );
};

const Login = ({
  username,
  setUsername,
  password,
  setPassword,
  onLogin,
  onShowRegister,
}) => {
  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Login Disini</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={onLogin} />
      <TouchableOpacity onPress={onShowRegister} style={styles.signUpButton}>
        <Text style={styles.signUpText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const UserDashboard = ({ onLogout }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [textItems, setTextItems] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleAddText = () => {
    if (title.trim() === '' || content.trim() === '') {
      alert('Judul dan isi teks tidak boleh kosong!');
      return;
    }
    if (editingIndex !== null) {
      
      const updatedTextItems = [...textItems];
      updatedTextItems[editingIndex] = { title, content };
      setTextItems(updatedTextItems);
      setEditingIndex(null);
    } else {
      
      setTextItems([...textItems, { title, content }]);
    }
    setTitle('');
    setContent('');
  };

  const handleEditText = (index) => {
    setTitle(textItems[index].title);
    setContent(textItems[index].content);
    setEditingIndex(index);
  };

  const handleDeleteText = (index) => {
    const updatedTextItems = textItems.filter((_, i) => i !== index);
    setTextItems(updatedTextItems);
  };

  const handleExportToPDF = async () => {
    if (textItems.length === 0) {
      alert('Tidak ada data untuk diekspor!');
      return;
    }

    const htmlContent = `
      <html>
        <body>
          <h1>${textItems.map(
            (item) => `
            <h3>${item.title}</h3>
            <p>${item.content}</p>`
          ).join('')}
          </h1>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error('Gagal membuat atau membagikan PDF:', error);
    }
  };

  return (
    <View style={styles.dashboardContainer}>
      <Text style={styles.welcomeText}>Selamat Datang, User</Text>
      <TextInput
        style={styles.input}
        placeholder="Judul Teks"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.plainTextInput}
        placeholder="Isi Teks"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <Button title={editingIndex !== null ? 'Update Teks' : 'Tambah Teks'} onPress={handleAddText} />
      <FlatList
        data={textItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.textItem}>
            <Text style={styles.titleText}>{item.title}</Text>
            <Text style={styles.contentText}>{item.content}</Text>
            <Button title="Edit" onPress={() => handleEditText(index)} />
            <Button title="Hapus" onPress={() => handleDeleteText(index)} />
          </View>
        )}
      />
      <Button title="Export ke PDF" onPress={handleExportToPDF} />
      <Button title="Logout" onPress={onLogout} />
    </View>
  );
};

const AdminDashboard = ({ onLogout }) => {
  return (
    <View style={styles.dashboardContainer}>
      <Text style={styles.welcomeText}>Selamat Datang, Admin</Text>
      <Text>Anda dapat mengedit teks.</Text>
      <Button title="Logout" onPress={onLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  signUpButton: {
    marginTop: 10,
  },
  signUpText: {
    color: 'blue',
    textAlign: 'center',
  },
  dashboardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 20,
  },
  textItem: {
    flexDirection: 'column',
    marginVertical: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '100%',
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  contentText: {
    fontSize: 14,
    marginTop: 5,
  },
  plainTextInput: {
    width: '100%',
    height: 200, 
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    fontFamily: 'Arial',
    fontSize: 16,
    textAlignVertical: 'top',
  },
});
  















