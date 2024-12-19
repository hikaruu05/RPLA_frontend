function UserDashboard() {
    return (
      <div className="container">
        <h1>User Dashboard</h1>
        <nav>
          <ul>
            <li><a href="/user/input">Input Data</a></li>
            <li><a href="/user/history">Riwayat Laporan</a></li>
          </ul>
        </nav>
        <p>Selamat datang di dashboard pengguna!</p>
      </div>
    );
  }
  export default UserDashboard;  // Pastikan ini ada