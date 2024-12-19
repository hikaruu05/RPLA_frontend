// components/user/ReportHistory.js
import React from 'react';

function ReportHistory() {
  // Dummy data for report history
  const reports = [
    { id: 1, title: 'Laporan 1', date: '2024-12-01', link: '#' },
    { id: 2, title: 'Laporan 2', date: '2024-12-05', link: '#' },
  ];

  return (
    <div>
      <h2>Riwayat Laporan</h2>
      <ul>
        {reports.map((report) => (
          <li key={report.id}>
            <a href={report.link}>{report.title}</a> - {report.date}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReportHistory;