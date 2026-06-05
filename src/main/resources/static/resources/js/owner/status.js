/* ── 통합현황 탭 전환 ── */
function switchStatusTab(tab) {
  var tabs = ['export-rank', 'import-rank', 'total-rank', 'trend'];
  tabs.forEach(function(t) {
    var el = document.getElementById('status-' + t);
    if (el) el.style.display = (t === tab) ? '' : 'none';
  });
  document.querySelectorAll('#pg-status .prog-tab').forEach(function(b, i) {
    b.classList.toggle('active', i === tabs.indexOf(tab));
  });
  // 탭 전환 시 차트 초기화 (필요한 경우)
  if (tab === 'import-rank' && !window._importRankChartInit) {
    window._importRankChartInit = true;
    initImportRankChart();
  }
  if (tab === 'total-rank' && !window._totalRankChartInit) {
    window._totalRankChartInit = true;
    initTotalRankChart();
    buildRankTable();
  }
  if (tab === 'trend' && !window._trendChartInit) {
    window._trendChartInit = true;
    initTrendCharts();
  }
}

/* ── 통합현황 차트 데이터 ── */
// 수출 TOP 10 데이터 (나: ABC글로벌 = 3위, 25건)
var exportRankData = {
  labels: ['1위 한국무역', '2위 글로벌상사', '3위 ABC글로벌★', '4위 대한수출', '5위 신한통상',
           '6위 한빛무역', '7위 동방상사', '8위 미래통상', '9위 태평양무역', '10위 서울상사'],
  data:   [32, 28, 25, 22, 19, 17, 15, 13, 11, 9],
  myIdx:  2
};
// 수입 TOP 10 데이터 (나: ABC글로벌 = 7위, 20건)
var importRankData = {
  labels: ['1위 대한수입', '2위 한국무역', '3위 글로벌상사', '4위 신한통상', '5위 한빛무역',
           '6위 동방상사', '7위 ABC글로벌★', '8위 미래통상', '9위 태평양무역', '10위 서울상사'],
  data:   [32, 28, 25, 22, 18, 16, 20, 12, 10, 8],
  myIdx:  6
};
// 종합 TOP 10 데이터 (나: ABC글로벌 = 5위, 45건)
var totalRankData = {
  labels: ['1위 한국무역', '2위 글로벌상사', '3위 대한수입', '4위 신한통상', '5위 ABC글로벌★',
           '6위 한빛무역', '7위 동방상사', '8위 미래통상', '9위 태평양무역', '10위 서울상사'],
  data:   [60, 55, 50, 48, 45, 40, 35, 28, 22, 17],
  myIdx:  4
};

function makeBarColors(data, myIdx) {
  return data.map(function(_, i) {
    return i === myIdx ? '#9f403d' : '#cbd5e1';
  });
}
function makeBarBorderColors(data, myIdx) {
  return data.map(function(_, i) {
    return i === myIdx ? '#7f1d1d' : '#94a3b8';
  });
}

/* ── 수출 순위 차트 초기화 ── */
function initExportRankChart() {
  var ctx = document.getElementById('exportRankChart');
  if (!ctx) return;
  new Chart(ctx.getContext('2d'), {
    type: 'bar',
    data: {
      labels: exportRankData.labels,
      datasets: [{
        label: '수출 건수',
        data: exportRankData.data,
        backgroundColor: makeBarColors(exportRankData.data, exportRankData.myIdx),
        borderColor: makeBarBorderColors(exportRankData.data, exportRankData.myIdx),
        borderWidth: 2
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              var suffix = ctx.dataIndex === exportRankData.myIdx ? ' ← 나' : '';
              return ' ' + ctx.parsed.x + '건' + suffix;
            }
          }
        }
      },
      scales: {
        x: { beginAtZero: true, grid: { color: '#f1f5f9' } },
        y: { ticks: { font: { size: 11 } } }
      }
    }
  });
}

/* ── 수입 순위 차트 초기화 ── */
function initImportRankChart() {
  var ctx = document.getElementById('importRankChart');
  if (!ctx) return;
  new Chart(ctx.getContext('2d'), {
    type: 'bar',
    data: {
      labels: importRankData.labels,
      datasets: [{
        label: '수입 건수',
        data: importRankData.data,
        backgroundColor: makeBarColors(importRankData.data, importRankData.myIdx),
        borderColor: makeBarBorderColors(importRankData.data, importRankData.myIdx),
        borderWidth: 2
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              var suffix = ctx.dataIndex === importRankData.myIdx ? ' ← 나' : '';
              return ' ' + ctx.parsed.x + '건' + suffix;
            }
          }
        }
      },
      scales: {
        x: { beginAtZero: true, grid: { color: '#f1f5f9' } },
        y: { ticks: { font: { size: 11 } } }
      }
    }
  });
}

/* ── 종합 순위 차트 초기화 ── */
function initTotalRankChart() {
  var ctx = document.getElementById('totalRankChart');
  if (!ctx) return;
  new Chart(ctx.getContext('2d'), {
    type: 'bar',
    data: {
      labels: totalRankData.labels,
      datasets: [{
        label: '총 의뢰 건수',
        data: totalRankData.data,
        backgroundColor: makeBarColors(totalRankData.data, totalRankData.myIdx),
        borderColor: makeBarBorderColors(totalRankData.data, totalRankData.myIdx),
        borderWidth: 2
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              var suffix = ctx.dataIndex === totalRankData.myIdx ? ' ← 나' : '';
              return ' ' + ctx.parsed.x + '건' + suffix;
            }
          }
        }
      },
      scales: {
        x: { beginAtZero: true, grid: { color: '#f1f5f9' } },
        y: { ticks: { font: { size: 11 } } }
      }
    }
  });
}

/* ── 종합 순위 테이블 빌드 ── */
function buildRankTable() {
  var tbody = document.getElementById('rank-table-body');
  if (!tbody) return;
  var allData = [
    { name: '한국무역', exp: 32, imp: 28, total: 60 },
    { name: '글로벌상사', exp: 28, imp: 27, total: 55 },
    { name: '대한수입', exp: 18, imp: 32, total: 50 },
    { name: '신한통상', exp: 26, imp: 22, total: 48 },
    { name: 'ABC글로벌 (나)', exp: 25, imp: 20, total: 45, isMe: true },
    { name: '한빛무역', exp: 22, imp: 18, total: 40 },
    { name: '동방상사', exp: 19, imp: 16, total: 35 },
    { name: '미래통상', exp: 15, imp: 13, total: 28 },
    { name: '태평양무역', exp: 12, imp: 10, total: 22 },
    { name: '서울상사', exp: 9, imp: 8, total: 17 },
    { name: '동아무역', exp: 8, imp: 7, total: 15 },
    { name: '한성통상', exp: 7, imp: 6, total: 13 },
    { name: '대양상사', exp: 6, imp: 6, total: 12 },
    { name: '삼성통상', exp: 6, imp: 5, total: 11 },
    { name: '우리무역', exp: 5, imp: 5, total: 10 },
    { name: '중앙상사', exp: 5, imp: 4, total: 9 },
    { name: '태성통상', exp: 4, imp: 4, total: 8 },
    { name: '한국상사', exp: 4, imp: 3, total: 7 },
    { name: '동성무역', exp: 3, imp: 3, total: 6 },
    { name: '신세계통상', exp: 3, imp: 2, total: 5 }
  ];
  var gradeMap = { 1: '🥇 최우수', 2: '🥈 최우수', 3: '🥉 최우수', 4: '우수', 5: '우수', 6: '일반', 7: '일반', 8: '일반', 9: '일반', 10: '일반' };
  tbody.innerHTML = allData.map(function(d, i) {
    var rank = i + 1;
    var isMe = d.isMe;
    var bg = isMe ? 'background:#fff8e1;font-weight:700;' : '';
    var nameTd = isMe ? '<strong style="color:#9f403d">' + d.name + '</strong>' : d.name;
    var grade = gradeMap[rank] || '일반';
    return '<tr style="' + bg + '">' +
      '<td style="font-weight:800;color:' + (rank <= 3 ? '#d97706' : '#475569') + ';text-align:center">' + rank + '</td>' +
      '<td>' + nameTd + '</td>' +
      '<td style="text-align:center">' + d.exp + '건</td>' +
      '<td style="text-align:center">' + d.imp + '건</td>' +
      '<td style="text-align:center;font-weight:700">' + d.total + '건</td>' +
      '<td style="text-align:center;font-size:11px">' + grade + '</td>' +
      '</tr>';
  }).join('');
}

/* ── 월별 추이 차트 초기화 ── */
function initTrendCharts() {
  var months = ['11월', '12월', '1월', '2월', '3월', '4월'];
  var myExport = [3, 4, 3, 5, 5, 8];
  var avgExport = [2.1, 2.3, 2.0, 2.4, 2.5, 2.8];
  var myImport = [2, 3, 2, 3, 4, 4];
  var avgImport = [1.8, 2.0, 1.7, 2.1, 2.2, 2.4];
  var myRank = [8, 7, 6, 5, 4, 3];
  var myImportRank = [10, 9, 9, 8, 8, 7];

  // 수출 추이
  var expCtx = document.getElementById('myExportTrendChart');
  if (expCtx) {
    new Chart(expCtx.getContext('2d'), {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: '나 (수출 건수)',
          data: myExport,
          borderColor: '#565e74',
          backgroundColor: 'rgba(86,94,116,0.12)',
          tension: 0.4, fill: true, borderWidth: 3,
          pointBackgroundColor: '#565e74', pointRadius: 5
        }, {
          label: '플랫폼 평균',
          data: avgExport,
          borderColor: '#94a3b8',
          backgroundColor: 'transparent',
          tension: 0.4, borderDash: [6, 3], borderWidth: 2,
          pointRadius: 3
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
        scales: { y: { beginAtZero: true, grid: { color: '#f1f5f9' } } }
      }
    });
  }

  // 수입 추이
  var impCtx = document.getElementById('myImportTrendChart');
  if (impCtx) {
    new Chart(impCtx.getContext('2d'), {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: '나 (수입 건수)',
          data: myImport,
          borderColor: '#d97706',
          backgroundColor: 'rgba(217,119,6,0.12)',
          tension: 0.4, fill: true, borderWidth: 3,
          pointBackgroundColor: '#d97706', pointRadius: 5
        }, {
          label: '플랫폼 평균',
          data: avgImport,
          borderColor: '#fbbf24',
          backgroundColor: 'transparent',
          tension: 0.4, borderDash: [6, 3], borderWidth: 2,
          pointRadius: 3
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
        scales: { y: { beginAtZero: true, grid: { color: '#f1f5f9' } } }
      }
    });
  }

  // 순위 변동 추이
  var rankCtx = document.getElementById('rankTrendChart');
  if (rankCtx) {
    new Chart(rankCtx.getContext('2d'), {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: '수출 순위',
          data: myRank,
          borderColor: '#565e74',
          backgroundColor: 'rgba(86,94,116,0.08)',
          tension: 0.4, fill: false, borderWidth: 3,
          pointBackgroundColor: '#565e74', pointRadius: 5
        }, {
          label: '수입 순위',
          data: myImportRank,
          borderColor: '#d97706',
          backgroundColor: 'rgba(217,119,6,0.08)',
          tension: 0.4, fill: false, borderWidth: 3,
          pointBackgroundColor: '#d97706', pointRadius: 5
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: function(ctx) { return ctx.dataset.label + ': ' + ctx.parsed.y + '위'; }
            }
          }
        },
        scales: {
          y: {
            reverse: true,
            beginAtZero: false,
            min: 1,
            ticks: { stepSize: 1, callback: function(v) { return v + '위'; } },
            grid: { color: '#f1f5f9' }
          }
        }
      }
    });
  }
}

/* ── 통합현황 차트 초기화 (DOMContentLoaded) ── */
window.addEventListener('DOMContentLoaded', function() {
  initExportRankChart();
});


