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
    applications: 'ใช้ในระบบการสื่อสารและกระจายเสียงหลัก: 1) วิทยุ AM (Amplitude Modulation) อาศัยการสะท้อนของคลื่นฟ้ากับชั้นบรรยากาศไอโอโนสเฟียร์ ทำให้ส่งสัญญาณไปได้ไกลข้ามทวีปแม้มีส่วนโค้งของโลก 2) วิทยุ FM (Frequency Modulation) และสัญญาณโทรทัศน์ ส่งคลื่นตรงในแนวสายตา (Line-of-Sight) ให้คุณภาพเสียงคมชัด ลดสัญญาณรบกวน 3) เครือข่ายโทรศัพท์เคลื่อนที่และวิทยุสื่อสารกู้ภัย ใช้ความถี่ช่วงสูงขึ้นในการรับส่งข้อมูลเสียงและสัญญาณดิจิทัล รวมถึงระบบวิทยุดาราศาสตร์ในการรับสัญญาณจากอวกาศ',
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
    applications: 'ประยุกต์ใช้ทั้งด้านพลังงานและการสื่อสารความเร็วสูง: 1) เตาไมโครเวฟ ใช้คลื่นความถี่ประมาณ 2.45 GHz กระตุ้นโมเลกุลของน้ำและไขมันในอาหารให้เกิดการสั่นพ้อง (Resonance) จนเกิดพลังงานความร้อนทำให้อาหารสุกรวดเร็วสม่ำเสมอจากภายใน 2) ระบบเรดาร์ (RADAR) ส่งคลื่นสะท้อนวัตถุเพื่อตรวจจับตำแหน่ง วัดระยะทาง และหาความเร็วของเครื่องบินหรือพายุตามหลักดอปเปลอร์ 3) การสื่อสารไร้สายความเร็วสูง เป็นแกนหลักของ Wi-Fi, Bluetooth, เสาสัญญาณ 4G/5G และเครือข่ายดาวเทียมนำทาง GPS',
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
    applications: 'หรือที่เรียกว่า "รังสีความร้อน" ปลดปล่อยจากวัตถุที่มีอุณหภูมิ: 1) อุปกรณ์ควบคุมระยะไกล (Remote Control) ส่งรหัสสัญญาณแสงอินฟราเรดสั่งการเครื่องใช้ไฟฟ้า เช่น ทีวี และเครื่องปรับอากาศ 2) กล้องถ่ายภาพความร้อน (Thermal Imaging) แปลงรังสีความร้อนเป็นภาพสี ตรวจคัดกรองผู้มีไข้ในอาคาร ตรวจหาจุดรั่วซึมความร้อนในโรงงาน และใช้มองในที่มืดสนิทสำหรับงานกู้ภัย 3) ทางการแพทย์และการสื่อสาร ใช้โคมอินฟราเรดบำบัดกล้ามเนื้อ บรรเทาอาการอักเสบ และใช้ส่งข้อมูลในสายเคเบิลใยแก้วนำแสง',
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
    applications: 'เป็นช่วงคลื่นที่เซลล์รูปกรวยและรูปแท่งในเรตินาของดวงตามนุษย์ตรวจรับได้: 1) การมองเห็นและระบบนิเวศ ทำให้สิ่งมีชีวิตแยกแยะรูปทรงและสีสัน ช่วยให้พืชสังเคราะห์ด้วยแสงเพื่อสร้างออกซิเจนและแป้งเป็นฐานของห่วงโซ่อาหาร 2) การสื่อสารข้อมูลความเร็วสูงผ่านเส้นใยนำแสง (Fiber Optics) อาศัยการสะท้อนกลับหมดของแสงเลเซอร์ส่งข้อมูลอินเทอร์เน็ตข้ามทวีปด้วยความเร็วเกือบเท่าแสง 3) เทคโนโลยีเลเซอร์และจอแสดงผล ใช้ในงานผ่าตัดรักษาตา (LASIK) เครื่องอ่านบาร์โค้ด และจอภาพ LED/OLED ในอุปกรณ์ดิจิทัล',
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
    applications: 'มีพลังงานสูงกว่าแสงขาว แผ่มาจากดวงอาทิตย์: 1) การฆ่าเชื้อโรค (UVGI โดยเฉพาะรังสี UV-C) ทำลายโครงสร้าง DNA/RNA ของเชื้อแบคทีเรียและไวรัส นิยมใช้ฆ่าเชื้อในห้องผ่าตัด หลอดฉายในระบบกรองน้ำดื่ม และตู้อบฆ่าเชื้อ 2) การตรวจสอบความปลอดภัยและนิติวิทยาศาสตร์ ฉายตรวจลายน้ำเรืองแสงบนธนบัตร หนังสือเดินทาง และคราบสารคัดหลั่งในที่เกิดเหตุ 3) ด้านสุขภาพและอุตสาหกรรม กระตุ้นให้ผิวหนังสร้างวิตามินดีในระดับที่พอเหมาะ และใช้บ่มแห้งสารเคลือบ กาว และวัสดุอุดฟันทางทันตกรรม',
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
    applications: 'รังสีพลังงานสูงที่ทะลุผ่านเนื้อเยื่ออ่อนได้ดีแต่ถูกดูดกลืนโดยกระดูกและโลหะ: 1) การตรวจวินิจฉัยทางการแพทย์ (Diagnostic Radiography) ฉายถ่ายภาพโครงสร้างกระดูกหัก ฟัน และใช้ในเครื่องเอกซเรย์คอมพิวเตอร์ (CT Scan) วิเคราะห์เนื้องอกและหลอดเลือดแบบ 3 มิติ 2) ระบบรักษาความปลอดภัย เครื่องเอกซเรย์ตรวจสัมภาระตามท่าอากาศยานและด่านศุลกากรโดยไม่ต้องเปิดกระเป๋า 3) งานวิศวกรรมและวิทยาศาสตร์ สแกนตรวจหารอยร้าว โพรงอากาศในรอยเชื่อมโครงสร้างเหล็ก และศึกษาการเลี้ยวเบนเพื่อหาโครงสร้างผลึกของสสาร (X-ray Crystallography)',
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
    applications: 'คลื่นแม่เหล็กไฟฟ้าพลังงานสูงสุด แผ่ออกจากนิวเคลียสของธาตุกัมมันตรังสี: 1) รังสีรักษาทางการแพทย์ (Radiotherapy) ใช้รังสีแกมมาพลังงานสูงจากโคบอลต์-60 หรือเครื่องมีดแกมมา (Gamma Knife) ยิงทำลายเซลล์มะเร็งและเนื้องอกในสมองอย่างแม่นยำ 2) การปลอดเชื้อระดับสูง ฉายรังสีทำลายเชื้อจุลินทรีย์บนเวชภัณฑ์ เข็มฉีดยา และเครื่องมือแพทย์ที่ไม่ทนความร้อน 3) การเกษตรและอุตสาหกรรม ฉายรังสีถนอมอาหาร ยับยั้งการงอกของหอมหัวใหญ่ ฆ่าแมลงผลไม้ส่งออก และใช้ตรวจวัดระดับของเหลวหรือรอยแตกร้าวในท่อส่งน้ำมันหนา',
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
