/**
 * @file constants.js
 * @description Physics constants and domain reference values for Unit 18 (EM Waves 18.1 - 18.3).
 * Follows physics-learning-standard naming conventions (UPPER_SNAKE_CASE for constants).
 */

/**
 * Fundamental Physics Constants
 */
export const SPEED_OF_LIGHT = 3.00e8; // m/s (สุญญากาศและอากาศ)
export const PLANCK_CONSTANT = 6.626e-34; // J·s
export const JOULE_TO_EV = 1 / 1.602176634e-19; // 1 eV = 1.602e-19 J
export const PI = Math.PI;

/**
 * Electromagnetic Spectrum Bands (7 ช่วงความถี่ตามตำรา สสวท. ม.6)
 * เรียงจากความถี่ต่ำสุด (ความยาวคลื่นมากสุด) ไปยังความถี่สูงสุด (ความยาวคลื่นน้อยสุด)
 */
export const SPECTRUM_BANDS = Object.freeze([
  {
    id: 'radio',
    name: 'Radio Waves',
    nameThai: 'คลื่นวิทยุ',
    frequencyMin: 3e3,       // 3 kHz
    frequencyMax: 3e9,       // 3 GHz
    wavelengthMin: 0.1,      // 0.1 m (10 cm)
    wavelengthMax: 1e5,      // 100 km
    color: '#3B82F6',        // Blue
    accentColor: 'rgba(59, 130, 246, 0.4)',
    applications: 'การสื่อสาร วิทยุ AM/FM, โทรทัศน์, สื่อสารดาวเทียม',
    dangers: 'ไม่มีอันตรายรุนแรง (Non-ionizing radiation)',
    description: 'คลื่นสะท้อนชั้นบรรยากาศไอโอโนสเฟียร์ (AM) หรือเดินทางเส้นตรง (FM/TV)'
  },
  {
    id: 'microwave',
    name: 'Microwaves',
    nameThai: 'ไมโครเวฟ',
    frequencyMin: 3e9,       // 3 GHz
    frequencyMax: 3e11,      // 300 GHz
    wavelengthMin: 1e-3,     // 1 mm
    wavelengthMax: 0.1,      // 10 cm
    color: '#06B6D4',        // Cyan
    accentColor: 'rgba(6, 182, 212, 0.4)',
    applications: 'เตาไมโครเวฟ, สัญญาณ Wi-Fi, บลูทูธ, ระบบเรดาร์ (Radar)',
    dangers: 'ทำให้เกิดความร้อนในเนื้อเยื่อที่มีน้ำเป็นองค์ประกอบ',
    description: 'ทำให้โมเลกุลของน้ำสั่นสะท้อนเกิดความร้อน และใช้เรดาร์วัดระยะทาง'
  },
  {
    id: 'infrared',
    name: 'Infrared Rays',
    nameThai: 'รังสีอินฟราเรด',
    frequencyMin: 3e11,      // 300 GHz
    frequencyMax: 4e14,      // 400 THz
    wavelengthMin: 7.5e-7,   // 750 nm
    wavelengthMax: 1e-3,     // 1 mm
    color: '#EF4444',        // Red / Infrared glow
    accentColor: 'rgba(239, 68, 68, 0.4)',
    applications: 'รีโมทคอนโทรล, กล้องถ่ายภาพความร้อน (Thermal Camera), การรักษาทางแพทย์',
    dangers: 'แสบตาและผิวหนังร้อนหากได้รับปริมาณมาก',
    description: 'ปลดปล่อยจากวัตถุที่มีความร้อน รู้จักในชื่อ "รังสีความร้อน"'
  },
  {
    id: 'visible',
    name: 'Visible Light',
    nameThai: 'แสงที่ตา มองเห็น',
    frequencyMin: 4e14,      // 400 THz (แดง)
    frequencyMax: 7.5e14,    // 750 THz (ม่วง)
    wavelengthMin: 4e-7,     // 400 nm (ม่วง)
    wavelengthMax: 7.5e-7,   // 750 nm (แดง)
    color: '#10B981',        // Green / Rainbow spectrum
    accentColor: 'rgba(16, 185, 129, 0.4)',
    applications: 'การมองเห็นของมนุษย์, การสังเคราะห์ด้วยแสงของพืช, เลเซอร์สีต่างๆ',
    dangers: 'แสงความเข้มสูงทำให้จอตาล้าหรือเสียหาย',
    description: 'ช่วงความถี่ที่กระตุ้นเรตินาในดวงตามนุษย์ (ม่วง คราม น้ำเงิน เขียว เหลือง แสด แดง)'
  },
  {
    id: 'ultraviolet',
    name: 'Ultraviolet Rays',
    nameThai: 'รังสีอัลตราไวโอเลต',
    frequencyMin: 7.5e14,    // 750 THz
    frequencyMax: 3e16,      // 30 PHz
    wavelengthMin: 1e-8,     // 10 nm
    wavelengthMax: 4e-7,     // 400 nm
    color: '#8B5CF6',        // Purple / UV
    accentColor: 'rgba(139, 92, 246, 0.4)',
    applications: 'การฆ่าเชื้อโรค (UV-C), ตรวจสอบธนบัตรปลอม, การสังเคราะห์วิตามินดีในผิวหนัง',
    dangers: 'ทำให้ผิวไหม้แดด (Sunburn), มะเร็งผิวหนัง, ต้อกระจก',
    description: 'แผ่มาจากดวงอาทิตย์ ถูกชั้นโอโซนดูดกลืนไว้บางส่วน'
  },
  {
    id: 'xray',
    name: 'X-Rays',
    nameThai: 'รังสีเอกซ์',
    frequencyMin: 3e16,      // 30 PHz
    frequencyMax: 3e19,      // 30 EHz
    wavelengthMin: 1e-11,    // 0.01 nm
    wavelengthMax: 1e-8,     // 10 nm
    color: '#F59E0B',        // Amber / Glowing orange
    accentColor: 'rgba(245, 158, 11, 0.4)',
    applications: 'ภาพถ่ายทางแพทย์ (X-ray Scan), การตรวจกระเป๋าเดินทางสนามบิน, ตรวจสอบรอยแตกร้าวโลหะ',
    dangers: 'รังสีแตกตัว (Ionizing radiation) ทำลาย DNA และเซลล์',
    description: 'เกิดจากการยิงอิเล็กตรอนความเร็วสูงเข้าชนเป้าโลหะ'
  },
  {
    id: 'gamma',
    name: 'Gamma Rays',
    nameThai: 'รังสีแกมมา',
    frequencyMin: 3e19,      // 30 EHz
    frequencyMax: 1e22,      // > 30 EHz
    wavelengthMin: 1e-14,    // < 0.01 nm
    wavelengthMax: 1e-11,    // 0.01 nm
    color: '#EC4899',        // Magenta / High energy pink
    accentColor: 'rgba(236, 72, 153, 0.4)',
    applications: 'การรักษามะเร็ง (Radiotherapy), การถนอมอาหารและฉายรังสีอุปกรณ์ทางการแพทย์',
    dangers: 'รังสีพลังงานสูงมากทำลายเซลล์สิ่งมีชีวิตอย่างรุนแรง กลายพันธุ์',
    description: 'แผ่ออกจากนิวเคลียสของธาตุรังสีหรือปฏิกิริยานิวเคลียร์'
  }
]);

/**
 * Visual Field Colors for Canvas Simulators
 */
export const EM_FIELD_COLORS = Object.freeze({
  E_FIELD: '#EF4444',       // Red for Electric Field Vector E
  E_FIELD_GLOW: 'rgba(239, 68, 68, 0.3)',
  B_FIELD: '#3B82F6',       // Blue for Magnetic Field Vector B
  B_FIELD_GLOW: 'rgba(59, 130, 246, 0.3)',
  VELOCITY: '#10B981',      // Green for Velocity Direction Vector v
  AXIS: '#64748B',          // Slate Gray for 3D coordinate axes
  POLAROID_SHEET: 'rgba(100, 116, 139, 0.25)', // Semi-transparent Polaroid
  POLAROID_AXIS: '#F59E0B', // Amber for transmission axis
  BACKGROUND: '#0F172A'     // Dark Slate Navy
});
