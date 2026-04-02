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
