/**
 * Web App — nhận form POST (application/x-www-form-urlencoded) từ site React,
 * ghi dòng vào Google Sheet. Không dùng setHeader (ContentService không hỗ trợ).
 *
 * Cài đặt:
 * 1) Thay SPREADSHEET_ID bằng ID file (trong URL của Google Sheet).
 * 2) Deploy > New deployment > Web app:
 *    - Execute as: Me
 *    - Who has access: Anyone (hoặc Anyone with Google account — tùy bạn)
 * 3) Dán URL deployment vào frontend: constants/api.ts → GOOGLE_SCRIPT_URL
 */

const SPREADSHEET_ID = 'PASTE_SPREADSHEET_ID_HERE';
const SHEET_NAME = 'Leads';

/** Tiêu đề cột (hiển thị trên Sheet — tiếng Việt) */
const HEADER = ['Thời gian', 'Họ tên', 'Điện thoại', 'Email', 'Nội dung'];

const COL_DATE = 1;
const COL_NAME = 2;
const COL_PHONE = 3;
const COL_EMAIL = 4;
const COL_MESSAGE = 5;

const COLOR_HEADER_BG = '#1565c0';
const COLOR_HEADER_FG = '#ffffff';
const COLOR_BORDER = '#cfd8dc';
const COLOR_ROW_EVEN = '#f5f9fc';
const COLOR_ROW_ODD = '#ffffff';
const COLOR_ACCENT = '#e3f2fd';

function doGet() {
  return jsonOut_({ ok: true, message: 'Leads endpoint is up. Use POST.' });
}

function doPost(e) {
  try {
    const p = e && e.parameter ? e.parameter : {};

    const name = safeStr_(p.name);
    const phone = safeStr_(p.phone);
    const email = safeStr_(p.email);
    const message = safeStr_(p.message);

    if (!name || !phone) {
      return jsonOut_({ success: false, error: 'Missing required fields: name/phone' });
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, HEADER.length).setValues([HEADER]);
      styleLeadsTable_(sheet, HEADER.length);
    }

    const nextRow = sheet.getLastRow() + 1;

    // Ghi phone = '' trước, rồi format TEXT + setValue — giữ số 0 đầu
    sheet.getRange(nextRow, 1, 1, 5).setValues([[
      new Date(),
      name,
      '',
      email,
      message,
    ]]);

    const phoneCell = sheet.getRange(nextRow, COL_PHONE);
    phoneCell.setNumberFormat('@');
    phoneCell.setValue(phone);

    formatLeadsDataRow_(sheet, nextRow, HEADER.length);

    return jsonOut_({ success: true });
  } catch (err) {
    return jsonOut_({ success: false, error: String(err) });
  }
}

function safeStr_(v) {
  if (v == null) return '';
  return String(v).trim();
}

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/**
 * Định dạng bảng một lần khi tạo sheet trống (header mới): filter, viền, cột, vùng dữ liệu.
 */
function styleLeadsTable_(sheet, numCols) {
  const maxRows = sheet.getMaxRows();
  const fullGrid = sheet.getRange(1, 1, maxRows, numCols);

  sheet.setFrozenRows(1);

  const headerRange = sheet.getRange(1, 1, 1, numCols);
  headerRange
    .setFontWeight('bold')
    .setFontSize(11)
    .setFontFamily('Roboto')
    .setBackground(COLOR_HEADER_BG)
    .setFontColor(COLOR_HEADER_FG)
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setWrap(false);
  headerRange.setBorder(
    true,
    true,
    true,
    true,
    null,
    null,
    COLOR_HEADER_BG,
    SpreadsheetApp.BorderStyle.SOLID_MEDIUM
  );

  sheet.setRowHeight(1, 36);

  sheet.setColumnWidth(COL_DATE, 168);
  sheet.setColumnWidth(COL_NAME, 200);
  sheet.setColumnWidth(COL_PHONE, 132);
  sheet.setColumnWidth(COL_EMAIL, 240);
  sheet.setColumnWidth(COL_MESSAGE, 380);

  // Vùng dưới header: căn trên, nền trắng mặc định (zebra áp khi có dòng)
  const bodyPreset = sheet.getRange(2, 1, maxRows, numCols);
  bodyPreset.setVerticalAlignment('top');
  bodyPreset.setFontSize(10);
  bodyPreset.setFontFamily('Roboto');

  thinBorderGrid_(fullGrid, COLOR_BORDER);

  try {
    const filterRange = sheet.getRange(1, 1, 1, numCols);
    if (!sheet.getFilter()) {
      filterRange.createFilter();
    }
  } catch (e) {
    // Bỏ qua nếu filter đã tồn tại hoặc không tạo được
  }

  sheet.getRange(2, COL_DATE, maxRows, COL_DATE).setNumberFormat('dd/mm/yyyy hh:mm:ss');
  sheet.getRange(2, COL_PHONE, maxRows, COL_PHONE).setNumberFormat('@');
}

/**
 * Viền mảng ô — đường kẻ mảnh đồng nhất.
 */
function thinBorderGrid_(range, color) {
  range.setBorder(
    true,
    true,
    true,
    true,
    true,
    true,
    color,
    SpreadsheetApp.BorderStyle.SOLID
  );
}

/**
 * Định dạng một dòng lead vừa thêm: zebra, viền, căn lề, chiều cao, wrap nội dung.
 */
function formatLeadsDataRow_(sheet, row, numCols) {
  const rowRange = sheet.getRange(row, 1, row, numCols);
  const zebra = row % 2 === 0 ? COLOR_ROW_EVEN : COLOR_ROW_ODD;

  rowRange.setBackground(zebra);
  thinBorderGrid_(rowRange, COLOR_BORDER);

  sheet
    .getRange(row, COL_DATE)
    .setNumberFormat('dd/mm/yyyy hh:mm:ss')
    .setHorizontalAlignment('center')
    .setBackground(zebra);

  sheet
    .getRange(row, COL_NAME)
    .setHorizontalAlignment('left')
    .setWrap(false);

  sheet
    .getRange(row, COL_PHONE)
    .setNumberFormat('@')
    .setHorizontalAlignment('center')
    .setBackground(COLOR_ACCENT);

  sheet
    .getRange(row, COL_EMAIL)
    .setHorizontalAlignment('left')
    .setWrap(false);

  sheet
    .getRange(row, COL_MESSAGE)
    .setWrap(true)
    .setHorizontalAlignment('left');

  const msgLen = String(sheet.getRange(row, COL_MESSAGE).getValue() || '').length;
  sheet.setRowHeight(row, msgLen > 120 ? 72 : msgLen > 60 ? 56 : 28);
}
