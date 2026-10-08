(() => {
  // src/shared/config.js
  var APP_CONFIG = Object.freeze({
    appName: "Interactive Physics Portal: Unit 18 \u0E04\u0E25\u0E37\u0E48\u0E19\u0E41\u0E21\u0E48\u0E40\u0E2B\u0E25\u0E47\u0E01\u0E44\u0E1F\u0E1F\u0E49\u0E32",
    version: "1.0.0",
    author: "Nopphorn Somboonchai",
    // Roll Number RNG Limits
    minRollNumber: 1,
    maxRollNumber: 40,
    defaultRollNumber: 1,
    // Exam Configuration
    examDurationMinutes: 15,
    examDurationSeconds: 15 * 60,
    examQuestionCount: 5,
    examMaxScore: 10,
    numericAnswerTolerance: 0.03,
    // 3% numerical error tolerance for grading
    // Canvas & Simulation Engine Specs
    canvas: {
      targetFPS: 60,
      aspectRatio: 16 / 9,
      defaultWidth: 800,
      defaultHeight: 450
    },
    // Simulator 18.1 Defaults
    emWaveDefaults: {
      frequency: 1e8,
      // 100 MHz (FM Radio)
      amplitude: 80,
      // Canvas pixels
      propagationSpeed: 2
      // Visual speed multiplier
    },
    // Simulator 18.2 Defaults
    spectrumDefaults: {
      initialFrequency: 5e14
      // 500 THz (Green light)
    },
    // Simulator 18.3 Defaults
    polarizationDefaults: {
      initialIntensity: 100,
      // I0 = 100%
      polarizerAngle: 0,
      // 0 degrees (Vertical)
      analyzerAngle: 45
      // 45 degrees
    },
    // LocalStorage Keys
    storageKeys: {
      examResult: "unit18_exam_result",
      examSession: "unit18_exam_session",
      userRollNumber: "unit18_user_roll_number",
      themePreference: "unit18_theme"
    }
  });

  // src/shared/constants.js
  var SPEED_OF_LIGHT = 3e8;
  var PLANCK_CONSTANT = 6626e-37;
  var JOULE_TO_EV = 1 / 1602176634e-28;
  var SPECTRUM_BANDS = Object.freeze([
    {
      id: "radio",
      name: "Radio Waves",
      nameThai: "\u0E04\u0E25\u0E37\u0E48\u0E19\u0E27\u0E34\u0E17\u0E22\u0E38",
      frequencyMin: 3e3,
      // 3 kHz
      frequencyMax: 3e9,
      // 3 GHz
      wavelengthMin: 0.1,
      // 0.1 m (10 cm)
      wavelengthMax: 1e5,
      // 100 km
      color: "#3B82F6",
      // Blue
      accentColor: "rgba(59, 130, 246, 0.4)",
      applications: "\u0E01\u0E32\u0E23\u0E2A\u0E37\u0E48\u0E2D\u0E2A\u0E32\u0E23 \u0E27\u0E34\u0E17\u0E22\u0E38 AM/FM, \u0E42\u0E17\u0E23\u0E17\u0E31\u0E28\u0E19\u0E4C, \u0E2A\u0E37\u0E48\u0E2D\u0E2A\u0E32\u0E23\u0E14\u0E32\u0E27\u0E40\u0E17\u0E35\u0E22\u0E21",
      dangers: "\u0E44\u0E21\u0E48\u0E21\u0E35\u0E2D\u0E31\u0E19\u0E15\u0E23\u0E32\u0E22\u0E23\u0E38\u0E19\u0E41\u0E23\u0E07 (Non-ionizing radiation)",
      description: "\u0E04\u0E25\u0E37\u0E48\u0E19\u0E2A\u0E30\u0E17\u0E49\u0E2D\u0E19\u0E0A\u0E31\u0E49\u0E19\u0E1A\u0E23\u0E23\u0E22\u0E32\u0E01\u0E32\u0E28\u0E44\u0E2D\u0E42\u0E2D\u0E42\u0E19\u0E2A\u0E40\u0E1F\u0E35\u0E22\u0E23\u0E4C (AM) \u0E2B\u0E23\u0E37\u0E2D\u0E40\u0E14\u0E34\u0E19\u0E17\u0E32\u0E07\u0E40\u0E2A\u0E49\u0E19\u0E15\u0E23\u0E07 (FM/TV)"
    },
    {
      id: "microwave",
      name: "Microwaves",
      nameThai: "\u0E44\u0E21\u0E42\u0E04\u0E23\u0E40\u0E27\u0E1F",
      frequencyMin: 3e9,
      // 3 GHz
      frequencyMax: 3e11,
      // 300 GHz
      wavelengthMin: 1e-3,
      // 1 mm
      wavelengthMax: 0.1,
      // 10 cm
      color: "#06B6D4",
      // Cyan
      accentColor: "rgba(6, 182, 212, 0.4)",
      applications: "\u0E40\u0E15\u0E32\u0E44\u0E21\u0E42\u0E04\u0E23\u0E40\u0E27\u0E1F, \u0E2A\u0E31\u0E0D\u0E0D\u0E32\u0E13 Wi-Fi, \u0E1A\u0E25\u0E39\u0E17\u0E39\u0E18, \u0E23\u0E30\u0E1A\u0E1A\u0E40\u0E23\u0E14\u0E32\u0E23\u0E4C (Radar)",
      dangers: "\u0E17\u0E33\u0E43\u0E2B\u0E49\u0E40\u0E01\u0E34\u0E14\u0E04\u0E27\u0E32\u0E21\u0E23\u0E49\u0E2D\u0E19\u0E43\u0E19\u0E40\u0E19\u0E37\u0E49\u0E2D\u0E40\u0E22\u0E37\u0E48\u0E2D\u0E17\u0E35\u0E48\u0E21\u0E35\u0E19\u0E49\u0E33\u0E40\u0E1B\u0E47\u0E19\u0E2D\u0E07\u0E04\u0E4C\u0E1B\u0E23\u0E30\u0E01\u0E2D\u0E1A",
      description: "\u0E17\u0E33\u0E43\u0E2B\u0E49\u0E42\u0E21\u0E40\u0E25\u0E01\u0E38\u0E25\u0E02\u0E2D\u0E07\u0E19\u0E49\u0E33\u0E2A\u0E31\u0E48\u0E19\u0E2A\u0E30\u0E17\u0E49\u0E2D\u0E19\u0E40\u0E01\u0E34\u0E14\u0E04\u0E27\u0E32\u0E21\u0E23\u0E49\u0E2D\u0E19 \u0E41\u0E25\u0E30\u0E43\u0E0A\u0E49\u0E40\u0E23\u0E14\u0E32\u0E23\u0E4C\u0E27\u0E31\u0E14\u0E23\u0E30\u0E22\u0E30\u0E17\u0E32\u0E07"
    },
    {
      id: "infrared",
      name: "Infrared Rays",
      nameThai: "\u0E23\u0E31\u0E07\u0E2A\u0E35\u0E2D\u0E34\u0E19\u0E1F\u0E23\u0E32\u0E40\u0E23\u0E14",
      frequencyMin: 3e11,
      // 300 GHz
      frequencyMax: 4e14,
      // 400 THz
      wavelengthMin: 75e-8,
      // 750 nm
      wavelengthMax: 1e-3,
      // 1 mm
      color: "#EF4444",
      // Red / Infrared glow
      accentColor: "rgba(239, 68, 68, 0.4)",
      applications: "\u0E23\u0E35\u0E42\u0E21\u0E17\u0E04\u0E2D\u0E19\u0E42\u0E17\u0E23\u0E25, \u0E01\u0E25\u0E49\u0E2D\u0E07\u0E16\u0E48\u0E32\u0E22\u0E20\u0E32\u0E1E\u0E04\u0E27\u0E32\u0E21\u0E23\u0E49\u0E2D\u0E19 (Thermal Camera), \u0E01\u0E32\u0E23\u0E23\u0E31\u0E01\u0E29\u0E32\u0E17\u0E32\u0E07\u0E41\u0E1E\u0E17\u0E22\u0E4C",
      dangers: "\u0E41\u0E2A\u0E1A\u0E15\u0E32\u0E41\u0E25\u0E30\u0E1C\u0E34\u0E27\u0E2B\u0E19\u0E31\u0E07\u0E23\u0E49\u0E2D\u0E19\u0E2B\u0E32\u0E01\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A\u0E1B\u0E23\u0E34\u0E21\u0E32\u0E13\u0E21\u0E32\u0E01",
      description: '\u0E1B\u0E25\u0E14\u0E1B\u0E25\u0E48\u0E2D\u0E22\u0E08\u0E32\u0E01\u0E27\u0E31\u0E15\u0E16\u0E38\u0E17\u0E35\u0E48\u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E23\u0E49\u0E2D\u0E19 \u0E23\u0E39\u0E49\u0E08\u0E31\u0E01\u0E43\u0E19\u0E0A\u0E37\u0E48\u0E2D "\u0E23\u0E31\u0E07\u0E2A\u0E35\u0E04\u0E27\u0E32\u0E21\u0E23\u0E49\u0E2D\u0E19"'
    },
    {
      id: "visible",
      name: "Visible Light",
      nameThai: "\u0E41\u0E2A\u0E07\u0E17\u0E35\u0E48\u0E15\u0E32 \u0E21\u0E2D\u0E07\u0E40\u0E2B\u0E47\u0E19",
      frequencyMin: 4e14,
      // 400 THz (แดง)
      frequencyMax: 75e13,
      // 750 THz (ม่วง)
      wavelengthMin: 4e-7,
      // 400 nm (ม่วง)
      wavelengthMax: 75e-8,
      // 750 nm (แดง)
      color: "#10B981",
      // Green / Rainbow spectrum
      accentColor: "rgba(16, 185, 129, 0.4)",
      applications: "\u0E01\u0E32\u0E23\u0E21\u0E2D\u0E07\u0E40\u0E2B\u0E47\u0E19\u0E02\u0E2D\u0E07\u0E21\u0E19\u0E38\u0E29\u0E22\u0E4C, \u0E01\u0E32\u0E23\u0E2A\u0E31\u0E07\u0E40\u0E04\u0E23\u0E32\u0E30\u0E2B\u0E4C\u0E14\u0E49\u0E27\u0E22\u0E41\u0E2A\u0E07\u0E02\u0E2D\u0E07\u0E1E\u0E37\u0E0A, \u0E40\u0E25\u0E40\u0E0B\u0E2D\u0E23\u0E4C\u0E2A\u0E35\u0E15\u0E48\u0E32\u0E07\u0E46",
      dangers: "\u0E41\u0E2A\u0E07\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E2A\u0E39\u0E07\u0E17\u0E33\u0E43\u0E2B\u0E49\u0E08\u0E2D\u0E15\u0E32\u0E25\u0E49\u0E32\u0E2B\u0E23\u0E37\u0E2D\u0E40\u0E2A\u0E35\u0E22\u0E2B\u0E32\u0E22",
      description: "\u0E0A\u0E48\u0E27\u0E07\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E17\u0E35\u0E48\u0E01\u0E23\u0E30\u0E15\u0E38\u0E49\u0E19\u0E40\u0E23\u0E15\u0E34\u0E19\u0E32\u0E43\u0E19\u0E14\u0E27\u0E07\u0E15\u0E32\u0E21\u0E19\u0E38\u0E29\u0E22\u0E4C (\u0E21\u0E48\u0E27\u0E07 \u0E04\u0E23\u0E32\u0E21 \u0E19\u0E49\u0E33\u0E40\u0E07\u0E34\u0E19 \u0E40\u0E02\u0E35\u0E22\u0E27 \u0E40\u0E2B\u0E25\u0E37\u0E2D\u0E07 \u0E41\u0E2A\u0E14 \u0E41\u0E14\u0E07)"
    },
    {
      id: "ultraviolet",
      name: "Ultraviolet Rays",
      nameThai: "\u0E23\u0E31\u0E07\u0E2A\u0E35\u0E2D\u0E31\u0E25\u0E15\u0E23\u0E32\u0E44\u0E27\u0E42\u0E2D\u0E40\u0E25\u0E15",
      frequencyMin: 75e13,
      // 750 THz
      frequencyMax: 3e16,
      // 30 PHz
      wavelengthMin: 1e-8,
      // 10 nm
      wavelengthMax: 4e-7,
      // 400 nm
      color: "#8B5CF6",
      // Purple / UV
      accentColor: "rgba(139, 92, 246, 0.4)",
      applications: "\u0E01\u0E32\u0E23\u0E06\u0E48\u0E32\u0E40\u0E0A\u0E37\u0E49\u0E2D\u0E42\u0E23\u0E04 (UV-C), \u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E18\u0E19\u0E1A\u0E31\u0E15\u0E23\u0E1B\u0E25\u0E2D\u0E21, \u0E01\u0E32\u0E23\u0E2A\u0E31\u0E07\u0E40\u0E04\u0E23\u0E32\u0E30\u0E2B\u0E4C\u0E27\u0E34\u0E15\u0E32\u0E21\u0E34\u0E19\u0E14\u0E35\u0E43\u0E19\u0E1C\u0E34\u0E27\u0E2B\u0E19\u0E31\u0E07",
      dangers: "\u0E17\u0E33\u0E43\u0E2B\u0E49\u0E1C\u0E34\u0E27\u0E44\u0E2B\u0E21\u0E49\u0E41\u0E14\u0E14 (Sunburn), \u0E21\u0E30\u0E40\u0E23\u0E47\u0E07\u0E1C\u0E34\u0E27\u0E2B\u0E19\u0E31\u0E07, \u0E15\u0E49\u0E2D\u0E01\u0E23\u0E30\u0E08\u0E01",
      description: "\u0E41\u0E1C\u0E48\u0E21\u0E32\u0E08\u0E32\u0E01\u0E14\u0E27\u0E07\u0E2D\u0E32\u0E17\u0E34\u0E15\u0E22\u0E4C \u0E16\u0E39\u0E01\u0E0A\u0E31\u0E49\u0E19\u0E42\u0E2D\u0E42\u0E0B\u0E19\u0E14\u0E39\u0E14\u0E01\u0E25\u0E37\u0E19\u0E44\u0E27\u0E49\u0E1A\u0E32\u0E07\u0E2A\u0E48\u0E27\u0E19"
    },
    {
      id: "xray",
      name: "X-Rays",
      nameThai: "\u0E23\u0E31\u0E07\u0E2A\u0E35\u0E40\u0E2D\u0E01\u0E0B\u0E4C",
      frequencyMin: 3e16,
      // 30 PHz
      frequencyMax: 3e19,
      // 30 EHz
      wavelengthMin: 1e-11,
      // 0.01 nm
      wavelengthMax: 1e-8,
      // 10 nm
      color: "#F59E0B",
      // Amber / Glowing orange
      accentColor: "rgba(245, 158, 11, 0.4)",
      applications: "\u0E20\u0E32\u0E1E\u0E16\u0E48\u0E32\u0E22\u0E17\u0E32\u0E07\u0E41\u0E1E\u0E17\u0E22\u0E4C (X-ray Scan), \u0E01\u0E32\u0E23\u0E15\u0E23\u0E27\u0E08\u0E01\u0E23\u0E30\u0E40\u0E1B\u0E4B\u0E32\u0E40\u0E14\u0E34\u0E19\u0E17\u0E32\u0E07\u0E2A\u0E19\u0E32\u0E21\u0E1A\u0E34\u0E19, \u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E23\u0E2D\u0E22\u0E41\u0E15\u0E01\u0E23\u0E49\u0E32\u0E27\u0E42\u0E25\u0E2B\u0E30",
      dangers: "\u0E23\u0E31\u0E07\u0E2A\u0E35\u0E41\u0E15\u0E01\u0E15\u0E31\u0E27 (Ionizing radiation) \u0E17\u0E33\u0E25\u0E32\u0E22 DNA \u0E41\u0E25\u0E30\u0E40\u0E0B\u0E25\u0E25\u0E4C",
      description: "\u0E40\u0E01\u0E34\u0E14\u0E08\u0E32\u0E01\u0E01\u0E32\u0E23\u0E22\u0E34\u0E07\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E04\u0E27\u0E32\u0E21\u0E40\u0E23\u0E47\u0E27\u0E2A\u0E39\u0E07\u0E40\u0E02\u0E49\u0E32\u0E0A\u0E19\u0E40\u0E1B\u0E49\u0E32\u0E42\u0E25\u0E2B\u0E30"
    },
    {
      id: "gamma",
      name: "Gamma Rays",
      nameThai: "\u0E23\u0E31\u0E07\u0E2A\u0E35\u0E41\u0E01\u0E21\u0E21\u0E32",
      frequencyMin: 3e19,
      // 30 EHz
      frequencyMax: 1e22,
      // > 30 EHz
      wavelengthMin: 1e-14,
      // < 0.01 nm
      wavelengthMax: 1e-11,
      // 0.01 nm
      color: "#EC4899",
      // Magenta / High energy pink
      accentColor: "rgba(236, 72, 153, 0.4)",
      applications: "\u0E01\u0E32\u0E23\u0E23\u0E31\u0E01\u0E29\u0E32\u0E21\u0E30\u0E40\u0E23\u0E47\u0E07 (Radiotherapy), \u0E01\u0E32\u0E23\u0E16\u0E19\u0E2D\u0E21\u0E2D\u0E32\u0E2B\u0E32\u0E23\u0E41\u0E25\u0E30\u0E09\u0E32\u0E22\u0E23\u0E31\u0E07\u0E2A\u0E35\u0E2D\u0E38\u0E1B\u0E01\u0E23\u0E13\u0E4C\u0E17\u0E32\u0E07\u0E01\u0E32\u0E23\u0E41\u0E1E\u0E17\u0E22\u0E4C",
      dangers: "\u0E23\u0E31\u0E07\u0E2A\u0E35\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E2A\u0E39\u0E07\u0E21\u0E32\u0E01\u0E17\u0E33\u0E25\u0E32\u0E22\u0E40\u0E0B\u0E25\u0E25\u0E4C\u0E2A\u0E34\u0E48\u0E07\u0E21\u0E35\u0E0A\u0E35\u0E27\u0E34\u0E15\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E23\u0E38\u0E19\u0E41\u0E23\u0E07 \u0E01\u0E25\u0E32\u0E22\u0E1E\u0E31\u0E19\u0E18\u0E38\u0E4C",
      description: "\u0E41\u0E1C\u0E48\u0E2D\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E19\u0E34\u0E27\u0E40\u0E04\u0E25\u0E35\u0E22\u0E2A\u0E02\u0E2D\u0E07\u0E18\u0E32\u0E15\u0E38\u0E23\u0E31\u0E07\u0E2A\u0E35\u0E2B\u0E23\u0E37\u0E2D\u0E1B\u0E0F\u0E34\u0E01\u0E34\u0E23\u0E34\u0E22\u0E32\u0E19\u0E34\u0E27\u0E40\u0E04\u0E25\u0E35\u0E22\u0E23\u0E4C"
    }
  ]);
  var EM_FIELD_COLORS = Object.freeze({
    E_FIELD: "#EF4444",
    // Red for Electric Field Vector E
    E_FIELD_GLOW: "rgba(239, 68, 68, 0.3)",
    B_FIELD: "#3B82F6",
    // Blue for Magnetic Field Vector B
    B_FIELD_GLOW: "rgba(59, 130, 246, 0.3)",
    VELOCITY: "#10B981",
    // Green for Velocity Direction Vector v
    AXIS: "#64748B",
    // Slate Gray for 3D coordinate axes
    POLAROID_SHEET: "rgba(100, 116, 139, 0.25)",
    // Semi-transparent Polaroid
    POLAROID_AXIS: "#F59E0B",
    // Amber for transmission axis
    BACKGROUND: "#0F172A"
    // Dark Slate Navy
  });

  // src/adapters/canvas/canvas-renderer.js
  var CanvasRenderer = class {
    /**
     * @param {HTMLCanvasElement} canvas - HTML5 Canvas element
     */
    constructor(canvas) {
      if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
        throw new Error("[CanvasRenderer] Valid HTMLCanvasElement is required");
      }
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.dpr = window.devicePixelRatio || 1;
      this.resize();
      this._handleResize = this.resize.bind(this);
      window.addEventListener("resize", this._handleResize);
    }
    /**
     * Handle canvas resize and scale for high DPI displays
     */
    resize() {
      const rect = this.canvas.getBoundingClientRect();
      const width = rect.width || this.canvas.width || 800;
      const height = rect.height || this.canvas.height || 400;
      this.width = width;
      this.height = height;
      this.canvas.width = Math.floor(width * this.dpr);
      this.canvas.height = Math.floor(height * this.dpr);
      this.ctx.scale(this.dpr, this.dpr);
    }
    /**
     * Clear canvas viewport
     * @param {string} [bgColor='#090D16'] - Background clear color
     */
    clear(bgColor = "#090D16") {
      this.ctx.fillStyle = bgColor;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }
    /**
     * Draw a line segment
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {string} [color='#FFFFFF']
     * @param {number} [lineWidth=1]
     * @param {number[]} [dash=[]]
     */
    drawLine(x1, y1, x2, y2, color = "#FFFFFF", lineWidth = 1, dash = []) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = lineWidth;
      if (dash.length > 0) {
        this.ctx.setLineDash(dash);
      }
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
      this.ctx.restore();
    }
    /**
     * Draw a vector arrow with arrowhead
     * @param {number} x1 - Start X
     * @param {number} y1 - Start Y
     * @param {number} x2 - End X
     * @param {number} y2 - End Y
     * @param {string} [color='#3B82F6'] - Line and head color
     * @param {number} [lineWidth=2]
     * @param {number} [headSize=8]
     */
    drawArrow(x1, y1, x2, y2, color = "#3B82F6", lineWidth = 2, headSize = 8) {
      const angle = Math.atan2(y2 - y1, x2 - x1);
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.strokeStyle = color;
      this.ctx.fillStyle = color;
      this.ctx.lineWidth = lineWidth;
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(x2, y2);
      this.ctx.lineTo(
        x2 - headSize * Math.cos(angle - Math.PI / 6),
        y2 - headSize * Math.sin(angle - Math.PI / 6)
      );
      this.ctx.lineTo(
        x2 - headSize * Math.cos(angle + Math.PI / 6),
        y2 - headSize * Math.sin(angle + Math.PI / 6)
      );
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.restore();
    }
    /**
     * Draw text label with optional background pill
     * @param {string} text
     * @param {number} x
     * @param {number} y
     * @param {Object} [options]
     */
    drawLabel(text, x, y, {
      font = "12px Sarabun, sans-serif",
      color = "#F8FAFC",
      align = "center",
      bgColor = null,
      padding = 4
    } = {}) {
      this.ctx.save();
      this.ctx.font = font;
      this.ctx.textAlign = align;
      this.ctx.textBaseline = "middle";
      if (bgColor) {
        const metrics = this.ctx.measureText(text);
        const textWidth = metrics.width;
        const textHeight = 14;
        let rectX = x - textWidth / 2 - padding;
        if (align === "left") rectX = x - padding;
        if (align === "right") rectX = x - textWidth - padding;
        this.ctx.fillStyle = bgColor;
        this.ctx.fillRect(rectX, y - textHeight / 2 - padding / 2, textWidth + padding * 2, textHeight + padding);
      }
      this.ctx.fillStyle = color;
      this.ctx.fillText(text, x, y);
      this.ctx.restore();
    }
    /**
     * Cleanup event listeners on destroy
     */
    destroy() {
      window.removeEventListener("resize", this._handleResize);
    }
  };

  // src/adapters/canvas/wave-field-plotter.js
  var WaveFieldPlotter = class extends CanvasRenderer {
    /**
     * @param {HTMLCanvasElement} canvas
     */
    constructor(canvas) {
      super(canvas);
      this.tiltAngle = Math.PI / 6;
    }
    /**
     * Render complete EM wave field
     * @param {Object} state - Simulator state from em-wave-simulator
     * @param {number} state.frequency - Frequency in Hz
     * @param {number} state.wavelength - Wavelength in meters
     * @param {number} state.phaseShift - Current phase shift from animation (radians)
     * @param {number} [state.amplitude=70] - Amplitude scale in pixels
     */
    render(state) {
      const { phaseShift = 0, amplitude = 70 } = state;
      this.clear("#090D16");
      const originX = 70;
      const originY = this.height / 2 + 10;
      const axisLengthX = this.width - 120;
      this.drawAxes(originX, originY, axisLengthX);
      const samples = 120;
      const stepX = axisLengthX / samples;
      const numCycles = 2.5;
      const k = 2 * Math.PI * numCycles / axisLengthX;
      const ePoints = [];
      const bPoints = [];
      for (let i = 0; i <= samples; i++) {
        const px = i * stepX;
        const val = Math.sin(k * px - phaseShift);
        const eY = originY - val * amplitude;
        const eX = originX + px;
        ePoints.push({ x: eX, y: eY, val });
        const bLen = val * amplitude * 0.7;
        const bX = originX + px + bLen * Math.cos(this.tiltAngle);
        const bY = originY + bLen * Math.sin(this.tiltAngle);
        bPoints.push({ x: bX, y: bY, val });
      }
      this.drawEnvelope(originX, originY, ePoints, "#cc785c", "rgba(204, 120, 92, 0.15)");
      this.drawEnvelope(originX, originY, bPoints, "#5db8a6", "rgba(93, 184, 166, 0.15)");
      const arrowInterval = 6;
      for (let i = 0; i <= samples; i += arrowInterval) {
        const eP = ePoints[i];
        const bP = bPoints[i];
        const posX = originX + i * stepX;
        if (Math.abs(eP.val) > 0.05) {
          this.drawArrow(posX, originY, eP.x, eP.y, "#cc785c", 1.8, 5);
        }
        if (Math.abs(bP.val) > 0.05) {
          this.drawArrow(posX, originY, bP.x, bP.y, "#5db8a6", 1.8, 5);
        }
      }
      const endX = originX + axisLengthX;
      this.drawArrow(endX - 40, originY, endX + 15, originY, "#10B981", 3, 10);
      this.drawLabel("v (\u0E17\u0E34\u0E28\u0E01\u0E32\u0E23\u0E40\u0E04\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E17\u0E35\u0E48)", endX + 25, originY - 15, {
        font: "bold 12px Prompt, sans-serif",
        color: "#10B981",
        align: "right",
        bgColor: "rgba(16, 185, 129, 0.15)"
      });
      this.drawLegend();
    }
    /**
     * Draw 3D coordinate system axes
     */
    drawAxes(ox, oy, axisLen) {
      this.drawLine(ox, oy, ox + axisLen + 20, oy, "#64748B", 1.5);
      this.drawLabel("X (\u0E41\u0E01\u0E19\u0E01\u0E32\u0E23\u0E41\u0E1C\u0E48)", ox + axisLen + 25, oy + 15, { font: "11px Sarabun, sans-serif", color: "#94A3B8" });
      this.drawLine(ox, oy + 110, ox, oy - 110, "#cc785c", 1.5, [4, 4]);
      this.drawLabel("+E (\u0E2A\u0E19\u0E32\u0E21\u0E44\u0E1F\u0E1F\u0E49\u0E32)", ox, oy - 120, { font: "bold 12px Prompt, sans-serif", color: "#cc785c" });
      const zLen = 90;
      const zX1 = ox - zLen * Math.cos(this.tiltAngle);
      const zY1 = oy - zLen * Math.sin(this.tiltAngle);
      const zX2 = ox + zLen * Math.cos(this.tiltAngle);
      const zY2 = oy + zLen * Math.sin(this.tiltAngle);
      this.drawLine(zX1, zY1, zX2, zY2, "#5db8a6", 1.5, [4, 4]);
      this.drawLabel("+B (\u0E2A\u0E19\u0E32\u0E21\u0E41\u0E21\u0E48\u0E40\u0E2B\u0E25\u0E47\u0E01)", zX2 + 15, zY2 + 10, { font: "bold 12px Prompt, sans-serif", color: "#5db8a6" });
    }
    /**
     * Draw wave envelope curve
     */
    drawEnvelope(ox, oy, points, strokeColor, fillColor) {
      if (points.length === 0) return;
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(ox, oy);
      for (let i = 0; i < points.length; i++) {
        this.ctx.lineTo(points[i].x, points[i].y);
      }
      this.ctx.lineTo(points[points.length - 1].x, oy);
      this.ctx.closePath();
      this.ctx.fillStyle = fillColor;
      this.ctx.fill();
      this.ctx.strokeStyle = strokeColor;
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      this.ctx.restore();
    }
    /**
     * Draw On-Canvas Legend for Vector Fields
     */
    drawLegend() {
      const lx = 20;
      const ly = 20;
      this.ctx.save();
      this.ctx.fillStyle = "rgba(24, 23, 21, 0.9)";
      this.ctx.strokeStyle = "rgba(230, 223, 216, 0.15)";
      this.ctx.lineWidth = 1;
      this.ctx.fillRect(lx, ly, 190, 75);
      this.ctx.strokeRect(lx, ly, 190, 75);
      this.drawArrow(lx + 10, ly + 20, lx + 35, ly + 20, "#cc785c", 2, 4);
      this.drawLabel("\u0E40\u0E27\u0E01\u0E40\u0E15\u0E2D\u0E23\u0E4C\u0E2A\u0E19\u0E32\u0E21\u0E44\u0E1F\u0E1F\u0E49\u0E32 E (\u0E15\u0E31\u0E49\u0E07\u0E09\u0E32\u0E01)", lx + 45, ly + 20, { font: "11px Sarabun, sans-serif", color: "#F8FAFC", align: "left" });
      this.drawArrow(lx + 10, ly + 40, lx + 35, ly + 40, "#5db8a6", 2, 4);
      this.drawLabel("\u0E40\u0E27\u0E01\u0E40\u0E15\u0E2D\u0E23\u0E4C\u0E2A\u0E19\u0E32\u0E21\u0E41\u0E21\u0E48\u0E40\u0E2B\u0E25\u0E47\u0E01 B (\u0E15\u0E31\u0E49\u0E07\u0E09\u0E32\u0E01)", lx + 45, ly + 40, { font: "11px Sarabun, sans-serif", color: "#F8FAFC", align: "left" });
      this.drawLabel("\u0E01\u0E0E\u0E21\u0E37\u0E2D\u0E02\u0E27\u0E32: E \xD7 B = v (\u0E40\u0E1F\u0E2A\u0E15\u0E23\u0E07\u0E01\u0E31\u0E19)", lx + 10, ly + 60, { font: "10px Sarabun, sans-serif", color: "#10B981", align: "left" });
      this.ctx.restore();
    }
  };

  // src/physics/em-wave-model.js
  function createEMWave({
    frequency = 1e8,
    wavelength = null,
    amplitude = 1,
    phase = 0,
    speed = SPEED_OF_LIGHT
  } = {}) {
    const validFreq = Math.max(1e-3, Number(frequency) || 1e8);
    const validSpeed = Math.max(1, Number(speed) || SPEED_OF_LIGHT);
    const validWavelength = wavelength ? Math.max(1e-18, Number(wavelength)) : validSpeed / validFreq;
    const bAmplitude = amplitude / validSpeed;
    const omega = 2 * Math.PI * validFreq;
    const k = 2 * Math.PI / validWavelength;
    return Object.freeze({
      frequency: validFreq,
      wavelength: validWavelength,
      speed: validSpeed,
      eAmplitude: amplitude,
      bAmplitude,
      phase,
      omega,
      k,
      /**
       * Compute instantaneous E-field and B-field at position x and time t.
       * E(x,t) = E0 * sin(kx - ωt + phase)
       * B(x,t) = B0 * sin(kx - ωt + phase) (In phase with E)
       * @param {number} x - Position along propagation axis (m)
       * @param {number} t - Time elapsed (s)
       * @returns {{ E: number, B: number }} Instantaneous E and B field values
       */
      evaluateFields(x = 0, t = 0) {
        const phaseValue = k * x - omega * t + phase;
        const sinVal = Math.sin(phaseValue);
        return {
          E: amplitude * sinVal,
          B: bAmplitude * sinVal
        };
      }
    });
  }

  // src/physics/em-wave-engine.js
  function calculateWavelength(frequency, speed = SPEED_OF_LIGHT) {
    const f = Number(frequency);
    const v = Number(speed);
    if (isNaN(f) || f <= 0) {
      throw new Error("[EMWaveEngine] Frequency must be a positive number");
    }
    if (isNaN(v) || v <= 0) {
      throw new Error("[EMWaveEngine] Speed must be a positive number");
    }
    return v / f;
  }
  function calculateFrequency(wavelength, speed = SPEED_OF_LIGHT) {
    const lambda = Number(wavelength);
    const v = Number(speed);
    if (isNaN(lambda) || lambda <= 0) {
      throw new Error("[EMWaveEngine] Wavelength must be a positive number");
    }
    if (isNaN(v) || v <= 0) {
      throw new Error("[EMWaveEngine] Speed must be a positive number");
    }
    return v / lambda;
  }
  function calculateAntennaLength(wavelength, type = "half-wave") {
    const lambda = Number(wavelength);
    if (isNaN(lambda) || lambda <= 0) {
      throw new Error("[EMWaveEngine] Wavelength must be a positive number");
    }
    if (type === "quarter-wave") {
      return lambda / 4;
    }
    return lambda / 2;
  }

  // src/application/em-wave-simulator.js
  var EMWaveSimulator = class {
    /**
     * @param {HTMLCanvasElement} canvas
     */
    constructor(canvas) {
      this.plotter = new WaveFieldPlotter(canvas);
      this.frequency = APP_CONFIG.emWaveDefaults.frequency;
      this.wavelength = calculateWavelength(this.frequency);
      this.emWaveModel = createEMWave({ frequency: this.frequency });
      this.phaseShift = 0;
      this.isAnimating = true;
      this.animFrameId = null;
      this.lastTimestamp = 0;
      this.onUpdateCallback = null;
      this.start();
    }
    /**
     * Update simulator parameters from UI controls
     * @param {number} newFrequency - Frequency in Hz
     */
    setFrequency(newFrequency) {
      this.frequency = Math.max(1e7, Number(newFrequency));
      this.wavelength = calculateWavelength(this.frequency);
      this.emWaveModel = createEMWave({ frequency: this.frequency });
      if (this.onUpdateCallback) {
        this.onUpdateCallback({
          frequency: this.frequency,
          wavelength: this.wavelength
        });
      }
      this.render();
    }
    /**
     * Start / Resume animation loop
     */
    start() {
      if (this.isAnimating && this.animFrameId) return;
      this.isAnimating = true;
      this.lastTimestamp = performance.now();
      this.loop(this.lastTimestamp);
    }
    /**
     * Pause animation loop
     */
    pause() {
      this.isAnimating = false;
      if (this.animFrameId) {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }
    }
    /**
     * Toggle Play / Pause state
     */
    toggleAnimation() {
      if (this.isAnimating) {
        this.pause();
      } else {
        this.start();
      }
      return this.isAnimating;
    }
    /**
     * Animation Frame Loop
     */
    loop(timestamp) {
      if (!this.isAnimating) return;
      const delta = (timestamp - this.lastTimestamp) / 1e3;
      this.lastTimestamp = timestamp;
      const speedMultiplier = 2.5;
      this.phaseShift += delta * speedMultiplier * (Math.log10(this.frequency) - 5);
      this.render();
      this.animFrameId = requestAnimationFrame((ts) => this.loop(ts));
    }
    /**
     * Render current frame to canvas
     */
    render() {
      this.plotter.render({
        frequency: this.frequency,
        wavelength: this.wavelength,
        phaseShift: this.phaseShift,
        amplitude: APP_CONFIG.emWaveDefaults.amplitude
      });
    }
    /**
     * Cleanup resources on tab destroy
     */
    destroy() {
      this.pause();
      this.plotter.destroy();
    }
  };

  // src/adapters/canvas/spectrum-plotter.js
  var SpectrumPlotter = class extends CanvasRenderer {
    /**
     * Render continuous spectrum band bar and cursor
     * @param {Object} state
     * @param {Object} state.selectedBand - Currently selected spectrum band
     * @param {number} state.frequency - Currently selected frequency in Hz
     */
    render(state) {
      const { selectedBand, frequency = 5e14 } = state;
      this.clear("#090D16");
      const paddingX = 40;
      const barY = 60;
      const barHeight = 60;
      const barWidth = this.width - paddingX * 2;
      const logMin = Math.log10(3e3);
      const logMax = Math.log10(1e22);
      const numBands = SPECTRUM_BANDS.length;
      const bandWidth = barWidth / numBands;
      for (let i = 0; i < numBands; i++) {
        const band = SPECTRUM_BANDS[i];
        const bx = paddingX + i * bandWidth;
        const isSelected = selectedBand && selectedBand.id === band.id;
        const grad = this.ctx.createLinearGradient(bx, barY, bx + bandWidth, barY);
        grad.addColorStop(0, band.color);
        grad.addColorStop(1, i < numBands - 1 ? SPECTRUM_BANDS[i + 1].color : band.color);
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(bx, barY, bandWidth, barHeight);
        if (isSelected) {
          this.ctx.strokeStyle = "#FFFFFF";
          this.ctx.lineWidth = 3;
          this.ctx.strokeRect(bx - 1, barY - 2, bandWidth + 2, barHeight + 4);
        }
        this.drawLabel(band.nameThai, bx + bandWidth / 2, barY - 15, {
          font: isSelected ? "bold 12px Prompt, sans-serif" : "11px Prompt, sans-serif",
          color: isSelected ? "#FFFFFF" : "#94A3B8"
        });
      }
      const axisY = barY + barHeight + 25;
      this.drawLine(paddingX, axisY, paddingX + barWidth, axisY, "#64748B", 1.5);
      const logTicks = [3, 6, 9, 12, 15, 18, 21];
      logTicks.forEach((exp) => {
        const frac = (exp - logMin) / (logMax - logMin);
        const tx = paddingX + frac * barWidth;
        this.drawLine(tx, axisY - 5, tx, axisY + 5, "#94A3B8", 1);
        this.drawLabel(`10^${exp} Hz`, tx, axisY + 18, {
          font: "10px JetBrains Mono, monospace",
          color: "#64748B"
        });
      });
      const currentLog = Math.log10(Math.max(3e3, frequency));
      const cursorFrac = Math.min(1, Math.max(0, (currentLog - logMin) / (logMax - logMin)));
      const cursorX = paddingX + cursorFrac * barWidth;
      this.ctx.save();
      this.ctx.shadowColor = selectedBand ? selectedBand.color : "#06B6D4";
      this.ctx.shadowBlur = 12;
      this.drawLine(cursorX, barY - 8, cursorX, barY + barHeight + 8, "#FFFFFF", 3);
      this.ctx.restore();
      this.ctx.fillStyle = "#FFFFFF";
      this.ctx.beginPath();
      this.ctx.moveTo(cursorX, barY - 12);
      this.ctx.lineTo(cursorX - 7, barY - 22);
      this.ctx.lineTo(cursorX + 7, barY - 22);
      this.ctx.closePath();
      this.ctx.fill();
      const freqFormatted = this.formatFreqText(frequency);
      this.drawLabel(freqFormatted, cursorX, barY - 32, {
        font: "bold 12px JetBrains Mono, monospace",
        color: "#06B6D4",
        bgColor: "rgba(15, 23, 42, 0.9)",
        padding: 6
      });
    }
    /**
     * Format frequency number to human readable SI units (kHz, MHz, GHz, THz, PHz, EHz)
     */
    formatFreqText(f) {
      if (f >= 1e18) return `${(f / 1e18).toFixed(2)} EHz`;
      if (f >= 1e15) return `${(f / 1e15).toFixed(2)} PHz`;
      if (f >= 1e12) return `${(f / 1e12).toFixed(2)} THz`;
      if (f >= 1e9) return `${(f / 1e9).toFixed(2)} GHz`;
      if (f >= 1e6) return `${(f / 1e6).toFixed(2)} MHz`;
      if (f >= 1e3) return `${(f / 1e3).toFixed(2)} kHz`;
      return `${f.toFixed(0)} Hz`;
    }
  };

  // src/physics/spectrum-band-model.js
  function findBandByFrequency(frequency) {
    const f = Number(frequency);
    if (isNaN(f) || f <= 0) {
      return SPECTRUM_BANDS[0];
    }
    for (const band of SPECTRUM_BANDS) {
      if (f >= band.frequencyMin && f <= band.frequencyMax) {
        return band;
      }
    }
    if (f < SPECTRUM_BANDS[0].frequencyMin) {
      return SPECTRUM_BANDS[0];
    }
    return SPECTRUM_BANDS[SPECTRUM_BANDS.length - 1];
  }

  // src/physics/spectrum-solver.js
  function calculatePhotonEnergy(frequency) {
    const f = Number(frequency);
    if (isNaN(f) || f <= 0) {
      throw new Error("[SpectrumSolver] Frequency must be a positive number");
    }
    const joules = PLANCK_CONSTANT * f;
    const electronVolts = joules * JOULE_TO_EV;
    return {
      joules,
      electronVolts
    };
  }
  function getSpectrumInfo(frequency) {
    const f = Number(frequency);
    const band = findBandByFrequency(f);
    const wavelength = SPEED_OF_LIGHT / f;
    const energy = calculatePhotonEnergy(f);
    return {
      frequency: f,
      wavelength,
      energyJoules: energy.joules,
      energyEv: energy.electronVolts,
      band
    };
  }

  // src/application/spectrum-simulator.js
  var SpectrumSimulator = class {
    /**
     * @param {HTMLCanvasElement} canvas
     */
    constructor(canvas) {
      this.plotter = new SpectrumPlotter(canvas);
      this.frequency = APP_CONFIG.spectrumDefaults.initialFrequency;
      this.onInfoChangeCallback = null;
      this._attachCanvasClickListener();
      this.updateFrequency(this.frequency);
    }
    /**
     * Update simulator frequency and trigger physics solver & render
     * @param {number} newFrequency - Frequency in Hz
     */
    updateFrequency(newFrequency) {
      this.frequency = Math.max(3e3, Number(newFrequency));
      this.spectrumInfo = getSpectrumInfo(this.frequency);
      if (this.onInfoChangeCallback) {
        this.onInfoChangeCallback(this.spectrumInfo);
      }
      this.render();
    }
    /**
     * Handle user click on Canvas spectrum bar to select frequency
     */
    _attachCanvasClickListener() {
      this.plotter.canvas.addEventListener("click", (evt) => {
        const rect = this.plotter.canvas.getBoundingClientRect();
        const clickX = evt.clientX - rect.left;
        const paddingX = 40;
        const barWidth = this.plotter.width - paddingX * 2;
        if (clickX >= paddingX && clickX <= paddingX + barWidth) {
          const frac = (clickX - paddingX) / barWidth;
          const logMin = Math.log10(3e3);
          const logMax = Math.log10(1e22);
          const targetLog = logMin + frac * (logMax - logMin);
          const targetFreq = Math.pow(10, targetLog);
          this.updateFrequency(targetFreq);
        }
      });
    }
    /**
     * Render canvas
     */
    render() {
      this.plotter.render({
        frequency: this.frequency,
        selectedBand: this.spectrumInfo ? this.spectrumInfo.band : null
      });
    }
    /**
     * Cleanup resources
     */
    destroy() {
      this.plotter.destroy();
    }
  };

  // src/adapters/canvas/polaroid-plotter.js
  var PolaroidPlotter = class extends CanvasRenderer {
    /**
     * Render complete polarization setup
     * @param {Object} state
     * @param {number} state.analyzerAngle - Analyzer angle θ in degrees (0..360)
     * @param {number} state.intensity1 - Intensity after P1 (e.g. 50%)
     * @param {number} state.intensity2 - Transmitted intensity after P2 (e.g. 0..50%)
     * @param {boolean} state.isCrossed - Whether polaroids are crossed (θ = 90° or 270°)
     */
    render(state) {
      const { analyzerAngle = 45, intensity1 = 50, intensity2 = 25, isCrossed = false } = state;
      this.clear("#090D16");
      const centerY = this.height / 2;
      const p1X = 260;
      const p2X = 540;
      this.drawLine(40, centerY, this.width - 50, centerY, "rgba(255, 255, 255, 0.15)", 1, [6, 6]);
      this.drawUnpolarizedBeam(40, p1X - 30, centerY);
      this.drawPolaroidSheet(p1X, centerY, 0, "P1: Polarizer", "#3B82F6");
      this.drawPolarizedBeam(p1X + 30, p2X - 30, centerY, 0, intensity1);
      this.drawPolaroidSheet(p2X, centerY, analyzerAngle, "P2: Analyzer", "#F59E0B");
      this.drawTransmittedBeam(p2X + 30, this.width - 60, centerY, analyzerAngle, intensity2, isCrossed);
      this.drawStatusOverlay(analyzerAngle, intensity2, isCrossed);
    }
    /**
     * Draw Unpolarized Light Beam (multi-directional arrows)
     */
    drawUnpolarizedBeam(x1, x2, cy) {
      const numRays = 4;
      const step = (x2 - x1) / numRays;
      for (let i = 0; i <= numRays; i++) {
        const rx = x1 + i * step;
        this.drawLine(rx, cy - 35, rx, cy + 35, "rgba(239, 68, 68, 0.6)", 1.5);
        this.drawLine(rx - 25, cy, rx + 25, cy, "rgba(59, 130, 246, 0.6)", 1.5);
        this.drawLine(rx - 18, cy - 18, rx + 18, cy + 18, "rgba(245, 158, 11, 0.5)", 1.2);
        this.drawLine(rx - 18, cy + 18, rx + 18, cy - 18, "rgba(245, 158, 11, 0.5)", 1.2);
      }
      this.drawLabel("\u0E41\u0E2A\u0E07\u0E44\u0E21\u0E48\u0E42\u0E1E\u0E25\u0E32\u0E44\u0E23\u0E2A\u0E4C (I\u2080 = 100%)", (x1 + x2) / 2, cy + 65, {
        font: "11px Sarabun, sans-serif",
        color: "#94A3B8"
      });
    }
    /**
     * Draw Polarized Light Beam (Single plane oscillation)
     */
    drawPolarizedBeam(x1, x2, cy, angleDeg, intensity) {
      const numRays = 4;
      const step = (x2 - x1) / numRays;
      const alpha = Math.max(0.15, intensity / 50);
      for (let i = 0; i <= numRays; i++) {
        const rx = x1 + i * step;
        this.drawLine(rx, cy - 30, rx, cy + 30, `rgba(239, 68, 68, ${alpha})`, 2.2);
        this.drawArrow(rx, cy, rx, cy - 30, `rgba(239, 68, 68, ${alpha})`, 2, 4);
        this.drawArrow(rx, cy, rx, cy + 30, `rgba(239, 68, 68, ${alpha})`, 2, 4);
      }
      this.drawLabel(`\u0E41\u0E2A\u0E07\u0E42\u0E1E\u0E25\u0E32\u0E44\u0E23\u0E2A\u0E4C\u0E40\u0E0A\u0E34\u0E07\u0E40\u0E2A\u0E49\u0E19 (I\u2081 = ${intensity.toFixed(1)}%)`, (x1 + x2) / 2, cy + 65, {
        font: "11px Sarabun, sans-serif",
        color: "#EF4444"
      });
    }
    /**
     * Draw Transmitted Light Beam after Analyzer P2
     */
    drawTransmittedBeam(x1, x2, cy, angleDeg, intensity, isCrossed) {
      if (isCrossed || intensity <= 0.1) {
        this.drawLabel("\u{1F512} \u0E41\u0E2A\u0E07\u0E16\u0E39\u0E01\u0E01\u0E31\u0E49\u0E19\u0E2A\u0E21\u0E1A\u0E39\u0E23\u0E13\u0E4C (I\u2082 = 0%)", (x1 + x2) / 2, cy, {
          font: "bold 12px Prompt, sans-serif",
          color: "#EF4444",
          bgColor: "rgba(239, 68, 68, 0.2)",
          padding: 6
        });
        return;
      }
      const numRays = 3;
      const step = (x2 - x1) / numRays;
      const alpha = Math.min(1, Math.max(0.1, intensity / 50));
      const rad = angleDeg * Math.PI / 180;
      const armLen = 30 * (intensity / 50);
      for (let i = 0; i <= numRays; i++) {
        const rx = x1 + i * step;
        const dx = armLen * Math.sin(rad);
        const dy = armLen * Math.cos(rad);
        this.drawLine(rx - dx, cy - dy, rx + dx, cy + dy, `rgba(245, 158, 11, ${alpha})`, 2.5);
        this.drawArrow(rx, cy, rx + dx, cy + dy, `rgba(245, 158, 11, ${alpha})`, 2, 4);
      }
      this.drawLabel(`\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E41\u0E2A\u0E07\u0E1C\u0E48\u0E32\u0E19\u0E2D\u0E2D\u0E01 (I\u2082 = ${intensity.toFixed(1)}%)`, (x1 + x2) / 2, cy + 65, {
        font: "bold 12px Prompt, sans-serif",
        color: "#F59E0B"
      });
    }
    /**
     * Draw Polaroid Filter Sheet Frame and Slits
     */
    drawPolaroidSheet(cx, cy, angleDeg, label, accentColor) {
      const width = 70;
      const height = 150;
      const rad = angleDeg * Math.PI / 180;
      this.ctx.save();
      this.ctx.translate(cx, cy);
      this.ctx.fillStyle = "rgba(30, 41, 59, 0.65)";
      this.ctx.strokeStyle = accentColor;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.roundRect(-width / 2, -height / 2, width, height, 10);
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.strokeStyle = accentColor;
      this.ctx.lineWidth = 1.5;
      this.ctx.setLineDash([4, 4]);
      const numSlits = 5;
      const slitLength = 110;
      for (let i = -2; i <= 2; i++) {
        const offsetX = i * 12;
        const dx = slitLength / 2 * Math.sin(rad);
        const dy = slitLength / 2 * Math.cos(rad);
        this.ctx.beginPath();
        this.ctx.moveTo(offsetX - dx, -dy);
        this.ctx.lineTo(offsetX + dx, dy);
        this.ctx.stroke();
      }
      this.ctx.restore();
      this.drawLabel(`${label} (${angleDeg}\xB0)`, cx, cy + height / 2 + 20, {
        font: "bold 12px Prompt, sans-serif",
        color: accentColor
      });
    }
    /**
     * Draw Overlay status info
     */
    drawStatusOverlay(angleDeg, intensity2, isCrossed) {
      this.drawLabel(`\u0E21\u0E38\u0E21 \u03B8 = ${angleDeg}\xB0`, 20, 20, {
        font: "bold 13px JetBrains Mono, monospace",
        color: isCrossed ? "#EF4444" : "#F59E0B",
        align: "left",
        bgColor: "rgba(15, 23, 42, 0.9)",
        padding: 6
      });
    }
  };

  // src/physics/polarization-solver.js
  function calculateMalusIntensity(I0, thetaDegrees) {
    const initialIntensity = Number(I0);
    const angleDeg = Number(thetaDegrees);
    if (isNaN(initialIntensity) || initialIntensity < 0) {
      throw new Error("[PolarizationSolver] Initial intensity I0 must be non-negative");
    }
    const thetaRad = angleDeg * Math.PI / 180;
    const cosVal = Math.cos(thetaRad);
    const transmittedIntensity = initialIntensity * (cosVal * cosVal);
    return transmittedIntensity < 1e-12 ? 0 : transmittedIntensity;
  }
  function calculateIntensityAfterPolarizer(I_unpolarized) {
    const i0 = Number(I_unpolarized);
    if (isNaN(i0) || i0 < 0) {
      throw new Error("[PolarizationSolver] Initial unpolarized intensity must be non-negative");
    }
    return i0 / 2;
  }
  function calculateIntensityThroughTwoPolaroids(I0, theta1Degrees, theta2Degrees) {
    const i1 = calculateIntensityAfterPolarizer(I0);
    const deltaTheta = Math.abs(theta2Degrees - theta1Degrees);
    const i2 = calculateMalusIntensity(i1, deltaTheta);
    const relativePct = i2 / Math.max(1e-9, Number(I0)) * 100;
    const isCrossed = Math.abs(deltaTheta % 180 - 90) < 1e-3;
    return {
      I1: i1,
      I2: i2,
      relativePercentage: relativePct,
      isCrossed
    };
  }

  // src/application/polarization-simulator.js
  var PolarizationSimulator = class {
    /**
     * @param {HTMLCanvasElement} canvas
     */
    constructor(canvas) {
      this.plotter = new PolaroidPlotter(canvas);
      this.polarizerAngle = APP_CONFIG.polarizationDefaults.polarizerAngle;
      this.analyzerAngle = APP_CONFIG.polarizationDefaults.analyzerAngle;
      this.initialIntensity = APP_CONFIG.polarizationDefaults.initialIntensity;
      this.onIntensityChangeCallback = null;
      this.setAnalyzerAngle(this.analyzerAngle);
    }
    /**
     * Update analyzer angle θ2 and re-evaluate Malus's Law
     * @param {number} newAngle - Angle in degrees (0..360)
     */
    setAnalyzerAngle(newAngle) {
      this.analyzerAngle = Number(newAngle) % 360;
      if (this.analyzerAngle < 0) this.analyzerAngle += 360;
      const result = calculateIntensityThroughTwoPolaroids(
        this.initialIntensity,
        this.polarizerAngle,
        this.analyzerAngle
      );
      this.intensity1 = result.I1;
      this.intensity2 = result.I2;
      this.isCrossed = result.isCrossed;
      if (this.onIntensityChangeCallback) {
        this.onIntensityChangeCallback({
          analyzerAngle: this.analyzerAngle,
          intensity1: this.intensity1,
          intensity2: this.intensity2,
          isCrossed: this.isCrossed
        });
      }
      this.render();
    }
    /**
     * Render canvas
     */
    render() {
      this.plotter.render({
        analyzerAngle: this.analyzerAngle,
        intensity1: this.intensity1,
        intensity2: this.intensity2,
        isCrossed: this.isCrossed
      });
    }
    /**
     * Cleanup resources
     */
    destroy() {
      this.plotter.destroy();
    }
  };

  // src/adapters/formula/katex-adapter.js
  var KaTeXAdapter = class {
    /**
     * Render LaTeX string into a target DOM element.
     * @param {string} latex - LaTeX formula string (e.g. "c = f\\lambda")
     * @param {HTMLElement|string} elementOrId - Target DOM element or element ID
     * @param {boolean} [displayMode=false] - True for centered block display ($$), false for inline ($)
     * @returns {boolean} Success status
     */
    static render(latex, elementOrId, displayMode = false) {
      if (typeof document === "undefined") return false;
      const el = typeof elementOrId === "string" ? document.getElementById(elementOrId) : elementOrId;
      if (!el) {
        console.warn(`[KaTeXAdapter] Target element "${elementOrId}" not found in DOM`);
        return false;
      }
      if (typeof window.katex === "undefined") {
        console.warn("[KaTeXAdapter] KaTeX library not loaded yet. Falling back to plain text.");
        el.textContent = latex;
        return false;
      }
      try {
        window.katex.render(latex, el, {
          displayMode,
          throwOnError: false,
          strict: false,
          output: "htmlAndMathml"
        });
        return true;
      } catch (err) {
        console.error("[KaTeXAdapter] KaTeX render error:", err);
        el.textContent = latex;
        return false;
      }
    }
    /**
     * Render LaTeX string to HTML string.
     * @param {string} latex
     * @param {boolean} [displayMode=false]
     * @returns {string}
     */
    static renderToString(latex, displayMode = false) {
      if (typeof window === "undefined" || typeof window.katex === "undefined") {
        return latex;
      }
      try {
        return window.katex.renderToString(latex, {
          displayMode,
          throwOnError: false,
          strict: false,
          output: "htmlAndMathml"
        });
      } catch (e) {
        return latex;
      }
    }
    /**
     * Safely scan and render all mathematical formulas in a container element.
     * Prioritizes official renderMathInElement (auto-render extension) for safe DOM text node handling.
     * @param {HTMLElement|string} [container=document.body]
     */
    static renderAllMath(container = document.body) {
      if (typeof document === "undefined") return;
      const targetEl = typeof container === "string" ? document.getElementById(container) : container;
      if (!targetEl) return;
      if (typeof window !== "undefined" && typeof window.renderMathInElement === "function") {
        try {
          window.renderMathInElement(targetEl, {
            delimiters: [
              { left: "$$", right: "$$", display: true },
              { left: "\\[", right: "\\]", display: true },
              { left: "\\(", right: "\\)", display: false },
              { left: "$", right: "$", display: false }
            ],
            ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code", "input", "select", "option"],
            throwOnError: false,
            strict: false,
            errorColor: "#ef4444"
          });
          return;
        } catch (err) {
          console.warn("[KaTeXAdapter] renderMathInElement failed, using fallback parser:", err);
        }
      }
      if (typeof window !== "undefined" && typeof window.katex !== "undefined") {
        this._fallbackRenderTextNodes(targetEl);
      }
    }
    /**
     * Internal text node parser fallback when renderMathInElement is not present.
     * Avoids destructive innerHTML assignments on container nodes.
     * @private
     */
    static _fallbackRenderTextNodes(container) {
      const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode(node) {
            if (!node.nodeValue || !node.nodeValue.includes("\\(") && !node.nodeValue.includes("$")) {
              return NodeFilter.FILTER_REJECT;
            }
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            const tag = parent.tagName.toLowerCase();
            if (["script", "style", "textarea", "pre", "code", "input", "select", "option"].includes(tag)) {
              return NodeFilter.FILTER_REJECT;
            }
            if (parent.closest(".katex")) {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );
      const nodesToReplace = [];
      let current;
      while (current = walker.nextNode()) {
        nodesToReplace.push(current);
      }
      nodesToReplace.forEach((textNode) => {
        const text = textNode.nodeValue;
        const mathRegex = /(\\\([\s\S]*?\\\))|(\$\$[\s\S]*?\$\$)|(\$[^\$]+?\$)/g;
        if (!mathRegex.test(text)) return;
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        let match;
        mathRegex.lastIndex = 0;
        while ((match = mathRegex.exec(text)) !== null) {
          if (match.index > lastIndex) {
            fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
          }
          const rawMath = match[0];
          let formula = "";
          let displayMode = false;
          if (rawMath.startsWith("\\(") && rawMath.endsWith("\\)")) {
            formula = rawMath.slice(2, -2);
            displayMode = false;
          } else if (rawMath.startsWith("$$") && rawMath.endsWith("$$")) {
            formula = rawMath.slice(2, -2);
            displayMode = true;
          } else if (rawMath.startsWith("$") && rawMath.endsWith("$")) {
            formula = rawMath.slice(1, -1);
            displayMode = false;
          }
          try {
            const span = document.createElement("span");
            window.katex.render(formula, span, {
              displayMode,
              throwOnError: false,
              strict: false
            });
            fragment.appendChild(span);
          } catch (e) {
            fragment.appendChild(document.createTextNode(rawMath));
          }
          lastIndex = match.index + rawMath.length;
        }
        if (lastIndex < text.length) {
          fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
        }
        if (textNode.parentNode) {
          textNode.parentNode.replaceChild(fragment, textNode);
        }
      });
    }
    /**
     * Pre-defined physics LaTeX formula templates for Unit 18 (Standardized Notation)
     */
    static TEMPLATES = Object.freeze({
      SPEED_OF_LIGHT: "c = f \\lambda = 3.00 \\times 10^8 \\text{ m/s}",
      WAVELENGTH_SOLVER: "\\lambda = \\frac{c}{f}",
      PHOTON_ENERGY: "E = hf = \\frac{hc}{\\lambda}",
      MALUS_LAW: "I = I_0 \\cos^2\\theta",
      POLAROID_TWO: "I_2 = I_1 \\cos^2(\\theta_2 - \\theta_1)",
      UNPOLARIZED_P1: "I_1 = \\frac{1}{2}I_0",
      VECTOR_FIELD: "\\vec{E} \\perp \\vec{B} \\perp \\vec{v}",
      PROPAGATION_DIRECTION: "\\hat{v} = \\hat{E} \\times \\hat{B}",
      PLANCK_CONSTANT: "h = 6.626 \\times 10^{-34} \\text{ J}\\cdot\\text{s}",
      EV_CONVERSION: "1 \\text{ eV} = 1.602 \\times 10^{-19} \\text{ J}"
    });
  };

  // src/adapters/ui/control-panel.js
  var ControlPanelAdapter = class {
    /**
     * Bind controls for Simulator 18.1 (EM Wave Vector Fields)
     * @param {Object} simulator - EMWaveSimulator instance
     */
    static bindEMWaveControls(simulator) {
      const sliderFreq = document.getElementById("slider-em-freq");
      const valFreq = document.getElementById("val-em-freq");
      const valWavelength = document.getElementById("val-em-wavelength");
      const btnToggleAnim = document.getElementById("btn-toggle-wave-anim");
      if (sliderFreq && valFreq && valWavelength) {
        sliderFreq.addEventListener("input", (e) => {
          const freqMHz = parseFloat(e.target.value);
          const freqHz = freqMHz * 1e6;
          valFreq.textContent = `${freqMHz.toFixed(2)} MHz`;
          simulator.setFrequency(freqHz);
        });
        simulator.onUpdateCallback = ({ wavelength }) => {
          valWavelength.textContent = `${wavelength.toFixed(2)} m`;
        };
      }
      if (btnToggleAnim) {
        btnToggleAnim.addEventListener("click", () => {
          const isNowPlaying = simulator.toggleAnimation();
          btnToggleAnim.innerHTML = isNowPlaying ? "<span>\u23F8\uFE0F</span> <span>\u0E2B\u0E22\u0E38\u0E14\u0E41\u0E2D\u0E19\u0E34\u0E40\u0E21\u0E0A\u0E31\u0E19</span>" : "<span>\u25B6\uFE0F</span> <span>\u0E40\u0E25\u0E48\u0E19\u0E41\u0E2D\u0E19\u0E34\u0E40\u0E21\u0E0A\u0E31\u0E19</span>";
        });
      }
    }
    /**
     * Bind controls for Simulator 18.2 (7 Spectrum Bands)
     * @param {Object} simulator - SpectrumSimulator instance
     */
    static bindSpectrumControls(simulator) {
      const bandName = document.getElementById("spectrum-band-name");
      const colorBadge = document.getElementById("spectrum-color-badge");
      const freqRange = document.getElementById("spectrum-freq-range");
      const waveRange = document.getElementById("spectrum-wave-range");
      const energyVal = document.getElementById("spectrum-energy-val");
      const appDesc = document.getElementById("spectrum-app-desc");
      simulator.onInfoChangeCallback = (info) => {
        const { band, energyEv, wavelength } = info;
        if (!band) return;
        if (bandName) bandName.textContent = `${band.nameThai} (${band.name})`;
        if (colorBadge) colorBadge.style.backgroundColor = band.color;
        if (freqRange) freqRange.textContent = `${formatSci(band.frequencyMin)} - ${formatSci(band.frequencyMax)} Hz`;
        if (waveRange) waveRange.textContent = `${formatSci(band.wavelengthMin)} - ${formatSci(band.wavelengthMax)} m`;
        if (energyVal) energyVal.textContent = `${energyEv.toExponential(2)} eV`;
        if (appDesc) appDesc.textContent = band.applications;
      };
    }
    /**
     * Bind controls for Simulator 18.3 (Polarization & Malus's Law)
     * @param {Object} simulator - PolarizationSimulator instance
     */
    static bindPolarizationControls(simulator) {
      const sliderAngle = document.getElementById("slider-analyzer-angle");
      const valAngle = document.getElementById("val-analyzer-angle");
      const valIntensity = document.getElementById("val-transmitted-intensity");
      if (sliderAngle && valAngle && valIntensity) {
        sliderAngle.addEventListener("input", (e) => {
          const angle = parseInt(e.target.value, 10);
          valAngle.textContent = `${angle}\xB0`;
          simulator.setAnalyzerAngle(angle);
        });
        simulator.onIntensityChangeCallback = ({ analyzerAngle, intensity2, isCrossed }) => {
          const frac = (intensity2 / 100).toFixed(2);
          valIntensity.innerHTML = `${intensity2.toFixed(1)}% (${KaTeXAdapter.renderToString(`${frac} I_0`)})`;
          if (isCrossed) {
            valIntensity.className = "text-sm font-bold font-mono text-red-400 bg-red-950/40 px-3 py-1.5 rounded-md border border-red-800";
          } else {
            valIntensity.className = "text-sm font-bold font-mono text-amber-400 bg-slate-800/80 px-3 py-1.5 rounded-md border border-slate-700";
          }
        };
      }
    }
  };
  function formatSci(num) {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)} GHz`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)} MHz`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)} kHz`;
    if (num < 1e-6) return `${(num * 1e9).toFixed(1)} nm`;
    if (num < 1e-3) return `${(num * 1e6).toFixed(1)} \xB5m`;
    if (num < 1) return `${(num * 1e3).toFixed(1)} mm`;
    return `${num.toFixed(1)}`;
  }

  // src/adapters/ui/tab-navigator.js
  var TabNavigatorAdapter = class {
    static isExamInProgress = false;
    static currentSection = "home";
    static currentReviewTab = "18-1-wave";
    static simulators = {};
    /**
     * Set exam protection lock state and switch to live exam section if active
     * @param {boolean} inProgress
     */
    static setExamInProgress(inProgress) {
      this.isExamInProgress = !!inProgress;
      this.updateExamLockUI();
      if (this.isExamInProgress) {
        this.showSection("exam-live");
      }
    }
    /**
     * Update visual lock styling and classes
     */
    static updateExamLockUI() {
      if (typeof document === "undefined") return;
      if (this.isExamInProgress) {
        document.documentElement.classList.add("exam-locked");
        document.body.classList.add("exam-locked");
      } else {
        document.documentElement.classList.remove("exam-locked");
        document.body.classList.remove("exam-locked");
      }
    }
    /**
     * Show target section and hide others (home, review, practice, exam-start, exam-live, exam-result)
     * @param {string} sectionId
     */
    static showSection(sectionId) {
      if (typeof document === "undefined") return;
      if (this.isExamInProgress && sectionId !== "exam-live" && sectionId !== "exam-result") {
        alert("\u26A0\uFE0F \u0E2D\u0E22\u0E39\u0E48\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07\u0E01\u0E32\u0E23\u0E17\u0E33\u0E02\u0E49\u0E2D\u0E2A\u0E2D\u0E1A\u0E40\u0E01\u0E47\u0E1A\u0E04\u0E30\u0E41\u0E19\u0E19 (15 \u0E19\u0E32\u0E17\u0E35)!\n\u0E04\u0E38\u0E13\u0E01\u0E33\u0E25\u0E31\u0E07\u0E17\u0E33\u0E02\u0E49\u0E2D\u0E2A\u0E2D\u0E1A\u0E2D\u0E22\u0E39\u0E48 \u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E44\u0E1B\u0E2B\u0E19\u0E49\u0E32\u0E2D\u0E37\u0E48\u0E19\u0E44\u0E14\u0E49\u0E08\u0E19\u0E01\u0E27\u0E48\u0E32\u0E08\u0E30\u0E2A\u0E48\u0E07\u0E02\u0E49\u0E2D\u0E2A\u0E2D\u0E1A");
        return;
      }
      this.currentSection = sectionId;
      const sections = ["home", "review", "practice", "exam-start", "exam-live", "exam-result"];
      sections.forEach((id) => {
        const el = document.getElementById(`sec-${id}`);
        if (el) {
          if (id === sectionId) {
            el.classList.remove("hidden");
          } else {
            el.classList.add("hidden");
          }
        }
      });
      const mobileMenu = document.getElementById("mobile-menu");
      if (mobileMenu) {
        mobileMenu.classList.add("hidden");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (sectionId === "review") {
        this.handleSimulatorLifecycle(this.currentReviewTab);
      } else {
        if (this.simulators.emWaveSim) {
          this.simulators.emWaveSim.pause();
        }
      }
      if (typeof requestAnimationFrame !== "undefined") {
        requestAnimationFrame(() => {
          const el = document.getElementById(`sec-${sectionId}`);
          if (el) KaTeXAdapter.renderAllMath(el);
        });
      }
    }
    /**
     * Switch review tab (18-1-wave, 18-2-spectrum, 18-3-polarization)
     * @param {string} tabId
     */
    static switchReviewTab(tabId) {
      if (typeof document === "undefined") return;
      this.currentReviewTab = tabId;
      const tabKeys = ["18-1-wave", "18-2-spectrum", "18-3-polarization"];
      tabKeys.forEach((key) => {
        const btn = document.getElementById(`btn-tab-${key}`);
        const content = document.getElementById(`review-tab-${key}`);
        if (btn) {
          if (key === tabId) {
            btn.className = "flex-1 min-w-[160px] text-center py-2.5 text-xs md:text-sm font-bold rounded-lg transition-all duration-200 bg-white text-blue-600 shadow-sm cursor-pointer";
          } else {
            btn.className = "flex-1 min-w-[160px] text-center py-2.5 text-xs md:text-sm font-bold rounded-lg transition-all duration-200 text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 cursor-pointer";
          }
        }
        if (content) {
          if (key === tabId) {
            content.classList.remove("hidden");
          } else {
            content.classList.add("hidden");
          }
        }
      });
      this.handleSimulatorLifecycle(tabId);
      if (typeof requestAnimationFrame !== "undefined") {
        requestAnimationFrame(() => {
          const content = document.getElementById(`review-tab-${tabId}`);
          if (content) KaTeXAdapter.renderAllMath(content);
        });
      }
    }
    /**
     * Manage active simulator lifecycle on sub-tab switch
     * @param {string} tabId
     */
    static handleSimulatorLifecycle(tabId) {
      const { emWaveSim, spectrumSim, polarizationSim } = this.simulators;
      if (tabId === "18-1-wave") {
        if (emWaveSim) emWaveSim.start();
      } else {
        if (emWaveSim) emWaveSim.pause();
      }
      if (tabId === "18-2-spectrum") {
        if (spectrumSim) spectrumSim.render();
      }
      if (tabId === "18-3-polarization") {
        if (polarizationSim) polarizationSim.render();
      }
    }
    /**
     * Toggle mobile navigation menu
     */
    static toggleMobileMenu() {
      if (typeof document === "undefined") return;
      const mobileMenu = document.getElementById("mobile-menu");
      if (mobileMenu) {
        mobileMenu.classList.toggle("hidden");
      }
    }
    /**
     * Backward-compatibility wrapper for switchToTab
     * @param {string} targetTabId
     */
    static switchToTab(targetTabId) {
      if (targetTabId === "tab-review") this.showSection("review");
      else if (targetTabId === "tab-practice") this.showSection("practice");
      else if (targetTabId === "tab-exam") this.showSection(this.isExamInProgress ? "exam-live" : "exam-start");
      else this.showSection(targetTabId.replace(/^tab-|^sec-/, ""));
    }
    /**
     * Initialize Tab Navigator
     * @param {Object} simulators - Dictionary of simulators { emWaveSim, spectrumSim, polarizationSim }
     */
    static init(simulators = {}) {
      this.simulators = simulators;
      if (typeof window !== "undefined") {
        window.showSection = (sectionId) => this.showSection(sectionId);
        window.switchReviewTab = (tabId) => this.switchReviewTab(tabId);
        window.toggleMobileMenu = () => this.toggleMobileMenu();
      }
      if (this.isExamInProgress) {
        this.showSection("exam-live");
      } else {
        this.showSection("home");
      }
    }
  };

  // src/utils/random.js
  function createSeededRNG(seed) {
    let s = seed >>> 0;
    return function() {
      let t = s += 1831565813;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function getSeededInt(rollNumber, questionIndex, min, max, attemptSeed = 0) {
    const seed = rollNumber * 10007 + questionIndex * 9973 + attemptSeed * 1013 + 12345 >>> 0;
    const rng = createSeededRNG(seed);
    return Math.floor(rng() * (max - min + 1)) + min;
  }
  function getSeededChoice(rollNumber, questionIndex, array, attemptSeed = 0) {
    if (!array || array.length === 0) return null;
    const idx = getSeededInt(rollNumber, questionIndex, 0, array.length - 1, attemptSeed);
    return array[idx];
  }
  function getSeededShuffle(rollNumber, questionIndex, array, attemptSeed = 0) {
    if (!Array.isArray(array)) return [];
    const shuffled = [...array];
    const seed = rollNumber * 10007 + questionIndex * 9973 + attemptSeed * 1013 + 24680 >>> 0;
    const rng = createSeededRNG(seed);
    for (let idx = shuffled.length - 1; idx > 0; idx--) {
      const swapIdx = Math.floor(rng() * (idx + 1));
      [shuffled[idx], shuffled[swapIdx]] = [shuffled[swapIdx], shuffled[idx]];
    }
    return shuffled;
  }
  function getDynamicParam(rollNumber, baseMin, baseStep, randomRange = 0, safetyBounds = {}, attemptSeed = void 0) {
    const R = Math.max(1, Math.min(40, Number(rollNumber) || 1));
    let randFloat = 0;
    if (attemptSeed !== void 0) {
      const seed = rollNumber * 10007 + attemptSeed * 9973 + 88888 >>> 0;
      const rng = createSeededRNG(seed);
      randFloat = rng();
    } else {
      randFloat = Math.random();
    }
    const randOffset = randomRange > 0 ? (randFloat - 0.5) * 2 * randomRange : 0;
    let val = baseMin + R * baseStep + randOffset;
    if (safetyBounds.min !== void 0 && val < safetyBounds.min) {
      val = safetyBounds.min;
    }
    if (safetyBounds.max !== void 0 && val > safetyBounds.max) {
      val = safetyBounds.max;
    }
    const decimals = safetyBounds.decimals !== void 0 ? safetyBounds.decimals : 2;
    const factor = Math.pow(10, decimals);
    return Math.round(val * factor) / factor;
  }

  // src/utils/validation.js
  function validateRollNumber(inputRollNumber) {
    const r = parseInt(inputRollNumber, 10);
    if (isNaN(r) || r < APP_CONFIG.minRollNumber) {
      return APP_CONFIG.minRollNumber;
    }
    if (r > APP_CONFIG.maxRollNumber) {
      return APP_CONFIG.maxRollNumber;
    }
    return r;
  }
  function validateNumericAnswer(userAnswer, correctAnswer, tolerance = APP_CONFIG.numericAnswerTolerance) {
    const uVal = parseFloat(userAnswer);
    const cVal = parseFloat(correctAnswer);
    if (isNaN(uVal)) {
      return {
        isCorrect: false,
        relativeErrorPercent: 100,
        userVal: NaN,
        correctVal: cVal,
        message: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E01\u0E23\u0E2D\u0E01\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E04\u0E33\u0E15\u0E2D\u0E1A"
      };
    }
    if (Math.abs(cVal) < 1e-9) {
      const isZeroMatch = Math.abs(uVal) < 1e-3;
      return {
        isCorrect: isZeroMatch,
        relativeErrorPercent: isZeroMatch ? 0 : 100,
        userVal: uVal,
        correctVal: cVal,
        message: isZeroMatch ? "\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07" : "\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07"
      };
    }
    const absDiff = Math.abs(uVal - cVal);
    const relError = absDiff / Math.abs(cVal);
    const isCorrect = relError <= tolerance;
    const errorPercent = relError * 100;
    return {
      isCorrect,
      relativeErrorPercent: Math.round(errorPercent * 100) / 100,
      userVal: uVal,
      correctVal: cVal,
      message: isCorrect ? "\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07!" : `\u0E04\u0E27\u0E32\u0E21\u0E04\u0E25\u0E32\u0E14\u0E40\u0E04\u0E25\u0E37\u0E48\u0E2D\u0E19 ${errorPercent.toFixed(1)}% (\u0E40\u0E01\u0E34\u0E19\u0E40\u0E01\u0E13\u0E11\u0E4C ${tolerance * 100}%)`
    };
  }

  // src/utils/format.js
  function formatLatexScientific(num, decimals = 2) {
    const val = Number(num);
    if (isNaN(val) || val === 0) return "0";
    const absVal = Math.abs(val);
    if (absVal >= 0.01 && absVal < 1e4) {
      return val.toFixed(decimals);
    }
    const exp = Math.floor(Math.log10(absVal));
    const mantissa = val / Math.pow(10, exp);
    return `${mantissa.toFixed(decimals)} \\times 10^{${exp}}`;
  }

  // src/application/quiz-manager.js
  var QuizManager = class {
    /**
     * @param {number} [rollNumber=1] - Student roll number R (1..40)
     */
    constructor(rollNumber = 1) {
      this.rollNumber = validateRollNumber(rollNumber);
      this.currentQuestionIndex = 0;
      this.currentQuestion = null;
      this.scoreHistory = [];
      this.attemptSeed = 0;
    }
    /**
     * Set student roll number and regenerate active question set
     * @param {number} newRollNumber
     */
    setRollNumber(newRollNumber) {
      this.rollNumber = validateRollNumber(newRollNumber);
      return this.generateQuestion(this.currentQuestionIndex);
    }
    /**
     * Generate question by category (18.1, 18.2, 18.3, or random)
     * @param {number} [questionIndex=0] - Index of question
     * @param {'18.1' | '18.2' | '18.3' | 'mixed'} [category='mixed']
     * @param {number} [customSeed=null] - Optional attempt seed for testing/reproducibility
     */
    generateQuestion(questionIndex = 0, category = "mixed", customSeed = null) {
      this.currentQuestionIndex = questionIndex;
      this.attemptSeed = customSeed !== null ? customSeed : (Date.now() ^ Math.floor(Math.random() * 1e5)) >>> 0;
      const R = this.rollNumber;
      const B = this.attemptSeed;
      let targetTopic = category;
      if (category === "mixed") {
        const topics = ["18.1", "18.2", "18.3"];
        targetTopic = getSeededChoice(R, questionIndex, topics, B);
      }
      switch (targetTopic) {
        case "18.1":
          this.currentQuestion = this._generateTopic181Question(R, questionIndex, B);
          break;
        case "18.2":
          this.currentQuestion = this._generateTopic182Question(R, questionIndex, B);
          break;
        case "18.3":
        default:
          this.currentQuestion = this._generateTopic183Question(R, questionIndex, B);
          break;
      }
      return this.currentQuestion;
    }
    /**
     * Topic 18.1: EM Wave speed c = fλ & Dipole Antenna Length
     * Dynamic Parameter Generation with Safety Constraints [50 MHz, 500 MHz]
     */
    _generateTopic181Question(R, qIndex, B) {
      const subType = (R + qIndex + B) % 2 === 0 ? 1 : 2;
      if (subType === 1) {
        const freqMHz = getDynamicParam(R, 80, 2.5, 10, { min: 50, max: 400, decimals: 1 }, B);
        const freqHz = freqMHz * 1e6;
        const correctWavelength = calculateWavelength(freqHz);
        return {
          id: `q_18_1_${qIndex}_${B}`,
          topic: "18.1 \u0E01\u0E32\u0E23\u0E40\u0E01\u0E34\u0E14\u0E04\u0E25\u0E37\u0E48\u0E19\u0E41\u0E21\u0E48\u0E40\u0E2B\u0E25\u0E47\u0E01\u0E44\u0E1F\u0E1F\u0E49\u0E32",
          title: `\u0E01\u0E32\u0E23\u0E04\u0E33\u0E19\u0E27\u0E13\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19\u0E41\u0E21\u0E48\u0E40\u0E2B\u0E25\u0E47\u0E01\u0E44\u0E1F\u0E1F\u0E49\u0E32 (\u0E40\u0E25\u0E02\u0E17\u0E35\u0E48 #${R})`,
          problemText: `\u0E2A\u0E16\u0E32\u0E19\u0E35\u0E27\u0E34\u0E17\u0E22\u0E38\u0E01\u0E23\u0E30\u0E08\u0E32\u0E22\u0E40\u0E2A\u0E35\u0E22\u0E07\u0E2A\u0E48\u0E07\u0E2A\u0E31\u0E0D\u0E0D\u0E32\u0E13\u0E14\u0E49\u0E27\u0E22\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48 \\(f = ${freqMHz.toFixed(1)} \\text{ MHz}\\) \u0E43\u0E19\u0E2D\u0E32\u0E01\u0E32\u0E28 \u0E16\u0E49\u0E32\u0E2D\u0E31\u0E15\u0E23\u0E32\u0E40\u0E23\u0E47\u0E27\u0E02\u0E2D\u0E07\u0E04\u0E25\u0E37\u0E48\u0E19\u0E41\u0E21\u0E48\u0E40\u0E2B\u0E25\u0E47\u0E01\u0E44\u0E1F\u0E1F\u0E49\u0E32\u0E43\u0E19\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E1A \\(c = 3.00 \\times 10^8 \\text{ m/s}\\) \u0E08\u0E07\u0E2B\u0E32\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19 (\\(\\lambda\\)) \u0E02\u0E2D\u0E07\u0E2A\u0E31\u0E0D\u0E0D\u0E32\u0E13\u0E27\u0E34\u0E17\u0E22\u0E38\u0E19\u0E35\u0E49\u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E40\u0E21\u0E15\u0E23 (m)`,
          unit: "m",
          correctAnswer: Math.round(correctWavelength * 100) / 100,
          tolerance: 0.03,
          solutionSteps: [
            `**\u0E2A\u0E39\u0E15\u0E23\u0E17\u0E35\u0E48\u0E43\u0E0A\u0E49**: \\(c = f\\lambda \\rightarrow \\lambda = \\frac{c}{f}\\)`,
            `\u0E41\u0E17\u0E19\u0E04\u0E48\u0E32\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48 \\(f = ${freqMHz.toFixed(1)} \\text{ MHz} = ${formatLatexScientific(freqHz)} \\text{ Hz}\\)`,
            `\u0E41\u0E17\u0E19\u0E04\u0E48\u0E32\u0E2D\u0E31\u0E15\u0E23\u0E32\u0E40\u0E23\u0E47\u0E27\u0E41\u0E2A\u0E07 \\(c = 3.00 \\times 10^8 \\text{ m/s}\\)`,
            `\\(\\lambda = \\frac{3.00 \\times 10^8}{${formatLatexScientific(freqHz)}} = ${correctWavelength.toFixed(3)} \\text{ m}\\)`,
            `**\u0E15\u0E2D\u0E1A**: \u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19\u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E1A **${correctWavelength.toFixed(2)} m**`
          ]
        };
      } else {
        const freqMHz = getDynamicParam(R, 100, 3, 12, { min: 80, max: 500, decimals: 1 }, B);
        const freqHz = freqMHz * 1e6;
        const lambda = calculateWavelength(freqHz);
        const antennaLength = calculateAntennaLength(lambda, "half-wave");
        return {
          id: `q_18_1_${qIndex}_${B}`,
          topic: "18.1 \u0E2A\u0E32\u0E22\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E41\u0E25\u0E30\u0E04\u0E25\u0E37\u0E48\u0E19\u0E41\u0E21\u0E48\u0E40\u0E2B\u0E25\u0E47\u0E01\u0E44\u0E1F\u0E1F\u0E49\u0E32",
          title: `\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E2A\u0E32\u0E22\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E23\u0E31\u0E1A\u0E2A\u0E31\u0E0D\u0E0D\u0E32\u0E13 (\u0E40\u0E25\u0E02\u0E17\u0E35\u0E48 #${R})`,
          problemText: `\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E2D\u0E2D\u0E01\u0E41\u0E1A\u0E1A\u0E2A\u0E32\u0E22\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E23\u0E31\u0E1A\u0E2A\u0E31\u0E0D\u0E0D\u0E32\u0E13\u0E27\u0E34\u0E17\u0E22\u0E38\u0E41\u0E1A\u0E1A\u0E44\u0E14\u0E42\u0E1E\u0E25\u0E04\u0E23\u0E36\u0E48\u0E07\u0E04\u0E25\u0E37\u0E48\u0E19 (Half-wave Dipole Antenna) \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E23\u0E31\u0E1A\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48 \\(f = ${freqMHz.toFixed(1)} \\text{ MHz}\\) \u0E08\u0E07\u0E04\u0E33\u0E19\u0E27\u0E13\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E02\u0E2D\u0E07\u0E2A\u0E32\u0E22\u0E2D\u0E32\u0E01\u0E32\u0E28 (\\(L = \\frac{\\lambda}{2}\\)) \u0E17\u0E35\u0E48\u0E40\u0E2B\u0E21\u0E32\u0E30\u0E2A\u0E21\u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E40\u0E21\u0E15\u0E23 (m)`,
          unit: "m",
          correctAnswer: Math.round(antennaLength * 100) / 100,
          tolerance: 0.03,
          solutionSteps: [
            `**\u0E2A\u0E39\u0E15\u0E23\u0E2B\u0E32\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19**: \\(\\lambda = \\frac{c}{f} = \\frac{3.00 \\times 10^8}{${formatLatexScientific(freqHz)}} = ${lambda.toFixed(3)} \\text{ m}\\)`,
            `**\u0E2A\u0E39\u0E15\u0E23\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E2A\u0E32\u0E22\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E04\u0E23\u0E36\u0E48\u0E07\u0E04\u0E25\u0E37\u0E48\u0E19**: \\(L = \\frac{\\lambda}{2}\\)`,
            `\\(L = \\frac{${lambda.toFixed(3)}}{2} = ${antennaLength.toFixed(3)} \\text{ m}\\)`,
            `**\u0E15\u0E2D\u0E1A**: \u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E2A\u0E32\u0E22\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E1A **${antennaLength.toFixed(2)} m**`
          ]
        };
      }
    }
    /**
     * Topic 18.2: Spectrum & Photon Energy E = hf
     * Dynamic Parameter Generation with Safety Constraints [3.5 x 10^14, 8.0 x 10^14 Hz]
     */
    _generateTopic182Question(R, qIndex, B) {
      const freqFactor = getDynamicParam(R, 3.8, 0.08, 0.5, { min: 3.5, max: 7.8, decimals: 2 }, B);
      const freqHz = freqFactor * 1e14;
      const energyObj = calculatePhotonEnergy(freqHz);
      const spectrumInfo = getSpectrumInfo(freqHz);
      return {
        id: `q_18_2_${qIndex}_${B}`,
        topic: "18.2 \u0E2A\u0E40\u0E1B\u0E01\u0E15\u0E23\u0E31\u0E21\u0E04\u0E25\u0E37\u0E48\u0E19\u0E41\u0E21\u0E48\u0E40\u0E2B\u0E25\u0E47\u0E01\u0E44\u0E1F\u0E1F\u0E49\u0E32",
        title: `\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E42\u0E1F\u0E15\u0E2D\u0E19\u0E02\u0E2D\u0E07\u0E04\u0E25\u0E37\u0E48\u0E19\u0E41\u0E21\u0E48\u0E40\u0E2B\u0E25\u0E47\u0E01\u0E44\u0E1F\u0E1F\u0E49\u0E32 (\u0E40\u0E25\u0E02\u0E17\u0E35\u0E48 #${R})`,
        problemText: `\u0E04\u0E25\u0E37\u0E48\u0E19\u0E41\u0E21\u0E48\u0E40\u0E2B\u0E25\u0E47\u0E01\u0E44\u0E1F\u0E1F\u0E49\u0E32\u0E43\u0E19\u0E22\u0E48\u0E32\u0E19${spectrumInfo.band.nameThai} \u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48 \\(f = ${freqFactor.toFixed(2)} \\times 10^{14} \\text{ Hz}\\) \u0E08\u0E07\u0E04\u0E33\u0E19\u0E27\u0E13\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E02\u0E2D\u0E07\u0E42\u0E1F\u0E15\u0E2D\u0E19 1 \u0E2D\u0E19\u0E38\u0E20\u0E32\u0E04 (\\(E = hf\\)) \u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E42\u0E27\u0E25\u0E15\u0E4C (eV) \u0E01\u0E33\u0E2B\u0E19\u0E14\u0E43\u0E2B\u0E49 \\(h = 6.626 \\times 10^{-34} \\text{ J}\\cdot\\text{s}\\) \u0E41\u0E25\u0E30 \\(1 \\text{ eV} = 1.602 \\times 10^{-19} \\text{ J}\\)`,
        unit: "eV",
        correctAnswer: Math.round(energyObj.electronVolts * 100) / 100,
        tolerance: 0.03,
        solutionSteps: [
          `**\u0E2A\u0E39\u0E15\u0E23\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E42\u0E1F\u0E15\u0E2D\u0E19**: \\(E = hf\\)`,
          `\u0E41\u0E17\u0E19\u0E04\u0E48\u0E32\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E08\u0E39\u0E25: \\(E = (6.626 \\times 10^{-34}) \\times (${freqFactor.toFixed(2)} \\times 10^{14}) = ${formatLatexScientific(energyObj.joules)} \\text{ J}\\)`,
          `\u0E41\u0E1B\u0E25\u0E07\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E40\u0E1B\u0E47\u0E19 eV: \\(E_{\\text{eV}} = \\frac{${formatLatexScientific(energyObj.joules)}}{1.602 \\times 10^{-19}} = ${energyObj.electronVolts.toFixed(3)} \\text{ eV}\\)`,
          `**\u0E15\u0E2D\u0E1A**: \u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E42\u0E1F\u0E15\u0E2D\u0E19\u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E1A **${energyObj.electronVolts.toFixed(2)} eV**`
        ]
      };
    }
    /**
     * Topic 18.3: Polarization & Malus's Law I = I0 * cos^2(θ)
     * Dynamic Parameter Generation restricted to standard angles θ ∈ {0°, 30°, 45°, 60°, 90°}
     */
    _generateTopic183Question(R, qIndex, B) {
      const standardAngles = [0, 30, 45, 60, 90];
      const angleDeg = getSeededChoice(R, qIndex, standardAngles, B);
      const initialIntensityPercent = 100;
      const I1 = calculateIntensityAfterPolarizer(initialIntensityPercent);
      const I2 = calculateMalusIntensity(I1, angleDeg);
      return {
        id: `q_18_3_${qIndex}_${B}`,
        topic: "18.3 \u0E42\u0E1E\u0E25\u0E32\u0E44\u0E23\u0E40\u0E0B\u0E0A\u0E31\u0E19\u0E02\u0E2D\u0E07\u0E04\u0E25\u0E37\u0E48\u0E19\u0E41\u0E21\u0E48\u0E40\u0E2B\u0E25\u0E47\u0E01\u0E44\u0E1F\u0E1F\u0E49\u0E32",
        title: `\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E41\u0E2A\u0E07\u0E15\u0E32\u0E21\u0E01\u0E0E\u0E02\u0E2D\u0E07\u0E21\u0E32\u0E25\u0E38\u0E2A (\u0E40\u0E25\u0E02\u0E17\u0E35\u0E48 #${R})`,
        problemText: `\u0E09\u0E32\u0E22\u0E25\u0E33\u0E41\u0E2A\u0E07\u0E44\u0E21\u0E48\u0E42\u0E1E\u0E25\u0E32\u0E44\u0E23\u0E2A\u0E4C\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E40\u0E23\u0E34\u0E48\u0E21\u0E15\u0E49\u0E19 \\(I_0\\) \u0E1C\u0E48\u0E32\u0E19\u0E41\u0E1C\u0E48\u0E19\u0E42\u0E1E\u0E25\u0E32\u0E23\u0E2D\u0E22\u0E14\u0E4C 2 \u0E41\u0E1C\u0E48\u0E19 \u0E42\u0E14\u0E22\u0E41\u0E1C\u0E48\u0E19\u0E41\u0E23\u0E01 (P1) \u0E27\u0E32\u0E07\u0E43\u0E19\u0E41\u0E19\u0E27\u0E15\u0E31\u0E49\u0E07 \u0E41\u0E25\u0E30\u0E41\u0E1C\u0E48\u0E19\u0E17\u0E35\u0E48\u0E2A\u0E2D\u0E07 (P2) \u0E2B\u0E21\u0E38\u0E19\u0E17\u0E33\u0E21\u0E38\u0E21 \\(\\theta = ${angleDeg}^\\circ\\) \u0E01\u0E31\u0E1A\u0E41\u0E1C\u0E48\u0E19\u0E41\u0E23\u0E01 \u0E08\u0E07\u0E04\u0E33\u0E19\u0E27\u0E13\u0E23\u0E49\u0E2D\u0E22\u0E25\u0E30\u0E02\u0E2D\u0E07\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E41\u0E2A\u0E07\u0E17\u0E35\u0E48\u0E2A\u0E48\u0E2D\u0E07\u0E1C\u0E48\u0E32\u0E19\u0E2D\u0E2D\u0E01\u0E2B\u0E25\u0E31\u0E07\u0E08\u0E32\u0E01\u0E41\u0E1C\u0E48\u0E19 P2 (\\(I_2\\)) \u0E40\u0E17\u0E35\u0E22\u0E1A\u0E01\u0E31\u0E1A\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E40\u0E23\u0E34\u0E48\u0E21\u0E15\u0E49\u0E19 \\(I_0\\) (\u0E23\u0E30\u0E1A\u0E38\u0E40\u0E09\u0E1E\u0E32\u0E30\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E23\u0E49\u0E2D\u0E22\u0E25\u0E30)`,
        unit: "%",
        correctAnswer: Math.round(I2 * 100) / 100,
        tolerance: 0.03,
        solutionSteps: [
          `**\u0E02\u0E31\u0E49\u0E19\u0E15\u0E2D\u0E19\u0E17\u0E35\u0E48 1 (\u0E41\u0E1C\u0E48\u0E19 P1)**: \u0E41\u0E2A\u0E07\u0E44\u0E21\u0E48\u0E42\u0E1E\u0E25\u0E32\u0E44\u0E23\u0E2A\u0E4C\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E1C\u0E48\u0E32\u0E19\u0E41\u0E1C\u0E48\u0E19\u0E41\u0E23\u0E01 \u0E08\u0E30\u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E25\u0E14\u0E25\u0E07\u0E40\u0E2B\u0E25\u0E37\u0E2D\u0E04\u0E23\u0E36\u0E48\u0E07\u0E2B\u0E19\u0E36\u0E48\u0E07 \\(I_1 = \\frac{1}{2}I_0 = 50\\%\\)`,
          `**\u0E02\u0E31\u0E49\u0E19\u0E15\u0E2D\u0E19\u0E17\u0E35\u0E48 2 (\u0E41\u0E1C\u0E48\u0E19 P2 \u0E15\u0E32\u0E21\u0E01\u0E0E\u0E02\u0E2D\u0E07\u0E21\u0E32\u0E25\u0E38\u0E2A)**: \\(I_2 = I_1 \\cos^2\\theta\\)`,
          `\u0E41\u0E17\u0E19\u0E04\u0E48\u0E32\u0E21\u0E38\u0E21\u0E21\u0E32\u0E15\u0E23\u0E10\u0E32\u0E19 \\(\\theta = ${angleDeg}^\\circ \\rightarrow \\cos(${angleDeg}^\\circ) = ${Math.cos(angleDeg * Math.PI / 180).toFixed(4)}\\)`,
          `\\(I_2 = 50 \\times \\cos^2(${angleDeg}^\\circ) = 50 \\times ${Math.pow(Math.cos(angleDeg * Math.PI / 180), 2).toFixed(4)} = ${I2.toFixed(2)}\\%\\)`,
          `**\u0E15\u0E2D\u0E1A**: \u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E41\u0E2A\u0E07\u0E17\u0E35\u0E48\u0E2A\u0E48\u0E2D\u0E07\u0E1C\u0E48\u0E32\u0E19\u0E41\u0E1C\u0E48\u0E19 P2 \u0E04\u0E34\u0E14\u0E40\u0E1B\u0E47\u0E19 **${I2.toFixed(2)}%** \u0E02\u0E2D\u0E07\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E40\u0E23\u0E34\u0E48\u0E21\u0E15\u0E49\u0E19`
        ]
      };
    }
    /**
     * Submit and grade user's answer
     * @param {number|string} userAnswer
     * @returns {Object} Full grading breakdown with step-by-step solution
     */
    evaluateAnswer(userAnswer) {
      if (!this.currentQuestion) {
        throw new Error("[QuizManager] No active question to evaluate");
      }
      const evalResult = validateNumericAnswer(
        userAnswer,
        this.currentQuestion.correctAnswer,
        this.currentQuestion.tolerance
      );
      const record = {
        questionId: this.currentQuestion.id,
        topic: this.currentQuestion.topic,
        rollNumber: this.rollNumber,
        userAnswer: evalResult.userVal,
        correctAnswer: evalResult.correctVal,
        isCorrect: evalResult.isCorrect,
        relativeErrorPercent: evalResult.relativeErrorPercent,
        solutionSteps: this.currentQuestion.solutionSteps
      };
      this.scoreHistory.push(record);
      return record;
    }
  };

  // src/adapters/ui/quiz-ui.js
  var QuizUIAdapter = class {
    constructor() {
      this.quizManager = new QuizManager(1);
      this.currentTopic = "18.1";
      this.currentMode = "standard";
      this.currentQuestion = null;
      this.questionCount = 0;
      this.init();
    }
    init() {
      if (typeof document === "undefined") return;
      if (typeof window !== "undefined") {
        window.currentPracticeTopic = this.currentTopic;
        window.startPracticeMode = (topic) => this.startPracticeMode(topic);
        window.regeneratePractice = () => this.generateQuestion();
        window.checkPracticeAnswer = () => this.checkNumericAnswer();
        window.checkPracticeChoice = (cIdx) => this.checkChoiceAnswer(cIdx);
      }
      const rollInput = document.getElementById("prac-student-roll");
      if (rollInput) {
        rollInput.addEventListener("change", (e) => {
          const roll = parseInt(e.target.value, 10);
          this.quizManager.setRollNumber(roll);
          this.generateQuestion();
        });
      }
      const modeSelect = document.getElementById("prac-mode-select");
      if (modeSelect) {
        modeSelect.addEventListener("change", (e) => {
          this.currentMode = e.target.value;
          this.generateQuestion();
        });
      }
      const inputVal1 = document.getElementById("prac-input-val1");
      if (inputVal1) {
        inputVal1.addEventListener("keyup", (e) => {
          if (e.key === "Enter") this.checkNumericAnswer();
        });
      }
      this.startPracticeMode("18.1");
    }
    /**
     * Switch practice topic (18.1, 18.2, 18.3)
     * @param {string} topic
     */
    startPracticeMode(topic) {
      this.currentTopic = topic;
      if (typeof window !== "undefined") window.currentPracticeTopic = topic;
      const topics = ["18.1", "18.2", "18.3"];
      topics.forEach((t) => {
        const btn = document.getElementById(`btn-prac-${t.replace(".", "-")}`);
        if (btn) {
          if (t === topic) {
            btn.classList.add("ring-2", "ring-blue-500", "bg-blue-50/50");
          } else {
            btn.classList.remove("ring-2", "ring-blue-500", "bg-blue-50/50");
          }
        }
      });
      this.generateQuestion();
    }
    /**
     * Generate next question
     */
    generateQuestion() {
      this.questionCount++;
      this.currentQuestion = this.quizManager.generateQuestion(this.questionCount, this.currentTopic);
      if (!this.currentQuestion) return;
      const titleEl = document.getElementById("prac-question-title");
      const textEl = document.getElementById("prac-question-text");
      const choiceZone = document.getElementById("prac-choice-zone");
      const numericZone = document.getElementById("prac-numeric-zone");
      const feedbackBox = document.getElementById("prac-feedback");
      const explBox = document.getElementById("prac-explanation-box");
      const inputVal1 = document.getElementById("prac-input-val1");
      if (feedbackBox) {
        feedbackBox.classList.add("hidden");
        feedbackBox.innerHTML = "";
      }
      if (explBox) explBox.classList.add("hidden");
      if (inputVal1) inputVal1.value = "";
      if (titleEl) {
        titleEl.textContent = `\u{1F4CB} \u0E02\u0E49\u0E2D\u0E04\u0E33\u0E16\u0E32\u0E21 (${this.currentQuestion.topic}) - ${this.currentQuestion.title}:`;
      }
      if (textEl) {
        textEl.innerHTML = this.currentQuestion.problemText;
      }
      if (this.currentQuestion.type === "choice") {
        if (choiceZone) choiceZone.classList.remove("hidden");
        if (numericZone) numericZone.classList.add("hidden");
        this.renderChoices();
      } else {
        if (choiceZone) choiceZone.classList.add("hidden");
        if (numericZone) numericZone.classList.remove("hidden");
        const lblInput = document.getElementById("lbl-prac-input-1");
        if (lblInput) {
          lblInput.textContent = `\u0E04\u0E33\u0E15\u0E2D\u0E1A (${this.currentQuestion.unit || "\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02"}):`;
        }
      }
      this.renderMathExpressions();
    }
    /**
     * Render choice buttons
     */
    renderChoices() {
      const choiceZone = document.getElementById("prac-choice-zone");
      if (!choiceZone || !this.currentQuestion.choices) return;
      choiceZone.innerHTML = this.currentQuestion.choices.map(
        (choice, idx) => `
        <button onclick="checkPracticeChoice(${idx})"
          class="prac-choice-btn w-full p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-slate-800 text-left font-medium text-sm transition-all flex items-center gap-3 cursor-pointer">
          <span class="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0">
            ${["\u0E01", "\u0E02", "\u0E04", "\u0E07"][idx] || idx + 1}
          </span>
          <span class="choice-text flex-1">${choice}</span>
        </button>
      `
      ).join("");
    }
    /**
     * Check choice answer
     */
    checkChoiceAnswer(choiceIdx) {
      if (!this.currentQuestion) return;
      const isCorrect = choiceIdx === this.currentQuestion.correctChoiceIndex;
      this.displayFeedback(isCorrect, isCorrect ? "\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E22\u0E2D\u0E14\u0E40\u0E22\u0E35\u0E48\u0E22\u0E21!" : "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07 \u0E25\u0E2D\u0E07\u0E28\u0E36\u0E01\u0E29\u0E32\u0E08\u0E32\u0E01\u0E27\u0E34\u0E18\u0E35\u0E17\u0E33\u0E14\u0E49\u0E32\u0E19\u0E25\u0E48\u0E32\u0E07");
    }
    /**
     * Check numeric answer
     */
    checkNumericAnswer() {
      if (!this.currentQuestion) return;
      const inputVal1 = document.getElementById("prac-input-val1");
      const userVal = inputVal1 ? inputVal1.value.trim() : "";
      if (!userVal) {
        alert("\u0E01\u0E23\u0E38\u0E13\u0E32\u0E01\u0E23\u0E2D\u0E01\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E01\u0E48\u0E2D\u0E19\u0E01\u0E14\u0E15\u0E23\u0E27\u0E08\u0E04\u0E33\u0E15\u0E2D\u0E1A");
        return;
      }
      const evalResult = this.quizManager.evaluateAnswer(userVal);
      this.displayFeedback(evalResult.isCorrect, evalResult.message);
    }
    /**
     * Display feedback banner and step-by-step solution
     */
    displayFeedback(isCorrect, message) {
      const feedbackBox = document.getElementById("prac-feedback");
      const explBox = document.getElementById("prac-explanation-box");
      const explText = document.getElementById("prac-explanation-text");
      if (feedbackBox) {
        feedbackBox.classList.remove("hidden");
        if (isCorrect) {
          feedbackBox.className = "p-5 rounded-2xl border bg-emerald-50 border-emerald-200 text-emerald-900 transition-all";
          feedbackBox.innerHTML = `
          <div class="flex items-center gap-3 font-bold text-base text-emerald-800 mb-1">
            <i class="fa-solid fa-circle-check text-2xl text-emerald-600"></i>
            <span>\u0E22\u0E34\u0E19\u0E14\u0E35\u0E14\u0E49\u0E27\u0E22! \u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07 \u{1F389}</span>
          </div>
          <p class="text-xs text-emerald-700">${message || "\u0E04\u0E38\u0E13\u0E04\u0E33\u0E19\u0E27\u0E13\u0E41\u0E25\u0E30\u0E15\u0E2D\u0E1A\u0E44\u0E14\u0E49\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E15\u0E32\u0E21\u0E2B\u0E25\u0E31\u0E01\u0E1F\u0E34\u0E2A\u0E34\u0E01\u0E2A\u0E4C"}</p>
        `;
        } else {
          feedbackBox.className = "p-5 rounded-2xl border bg-red-50 border-red-200 text-red-900 transition-all";
          feedbackBox.innerHTML = `
          <div class="flex items-center gap-3 font-bold text-base text-red-800 mb-1">
            <i class="fa-solid fa-circle-xmark text-2xl text-red-600"></i>
            <span>\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07 \u274C</span>
          </div>
          <p class="text-xs text-red-700">${message || "\u0E25\u0E2D\u0E07\u0E17\u0E1A\u0E17\u0E27\u0E19\u0E2A\u0E39\u0E15\u0E23\u0E41\u0E25\u0E30\u0E02\u0E31\u0E49\u0E19\u0E15\u0E2D\u0E19\u0E01\u0E32\u0E23\u0E04\u0E33\u0E19\u0E27\u0E13\u0E43\u0E19\u0E27\u0E34\u0E18\u0E35\u0E17\u0E33\u0E14\u0E49\u0E32\u0E19\u0E25\u0E48\u0E32\u0E07"}</p>
        `;
        }
      }
      if (explBox && explText && this.currentQuestion.solutionSteps) {
        explBox.classList.remove("hidden");
        explText.innerHTML = `
        <ol class="list-decimal pl-5 space-y-2">
          ${this.currentQuestion.solutionSteps.map((step) => `<li>${step}</li>`).join("")}
        </ol>
      `;
      }
      this.renderMathExpressions();
    }
    /**
     * Render KaTeX mathematical expressions safely via KaTeXAdapter
     */
    renderMathExpressions() {
      const container = document.getElementById("sec-practice");
      if (container) {
        KaTeXAdapter.renderAllMath(container);
      }
    }
  };

  // src/adapters/storage/local-storage.js
  var LocalStorageAdapter = class {
    /**
     * Save exam result object to LocalStorage
     * @param {Object} result - Exam result data
     * @returns {boolean} Success status
     */
    static saveExamResult(result) {
      try {
        const key = APP_CONFIG.storageKeys.examResult;
        const serialized = JSON.stringify({
          ...result,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
        localStorage.setItem(key, serialized);
        return true;
      } catch (err) {
        console.warn("[LocalStorageAdapter] Failed to save exam result:", err);
        return false;
      }
    }
    /**
     * Load last saved exam result from LocalStorage
     * @returns {Object|null} Exam result object or null
     */
    static loadExamResult() {
      try {
        const key = APP_CONFIG.storageKeys.examResult;
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (err) {
        console.warn("[LocalStorageAdapter] Failed to load exam result:", err);
        return null;
      }
    }
    /**
     * Clear saved exam result from LocalStorage
     * @returns {boolean} Success status
     */
    static clearExamResult() {
      try {
        const key = APP_CONFIG.storageKeys.examResult;
        localStorage.removeItem(key);
        return true;
      } catch (err) {
        console.warn("[LocalStorageAdapter] Failed to clear exam result:", err);
        return false;
      }
    }
    /**
     * Save active in-progress exam session to LocalStorage
     * @param {Object} sessionData - Active exam state and question data
     * @returns {boolean} Success status
     */
    static saveExamSession(sessionData) {
      try {
        const key = APP_CONFIG.storageKeys.examSession;
        const serialized = JSON.stringify(sessionData);
        localStorage.setItem(key, serialized);
        return true;
      } catch (err) {
        console.warn("[LocalStorageAdapter] Failed to save exam session:", err);
        return false;
      }
    }
    /**
     * Load saved active exam session from LocalStorage
     * @returns {Object|null} Exam session object or null
     */
    static loadExamSession() {
      try {
        const key = APP_CONFIG.storageKeys.examSession;
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (err) {
        console.warn("[LocalStorageAdapter] Failed to load exam session:", err);
        return null;
      }
    }
    /**
     * Clear saved active exam session from LocalStorage
     * @returns {boolean} Success status
     */
    static clearExamSession() {
      try {
        const key = APP_CONFIG.storageKeys.examSession;
        localStorage.removeItem(key);
        return true;
      } catch (err) {
        console.warn("[LocalStorageAdapter] Failed to clear exam session:", err);
        return false;
      }
    }
  };

  // src/application/exam-manager.js
  var EXAM_STATES = Object.freeze({
    IDLE: "IDLE",
    STARTED: "STARTED",
    IN_PROGRESS: "IN_PROGRESS",
    SUBMITTED: "SUBMITTED",
    REVIEW: "REVIEW"
  });
  var ExamManager = class {
    /**
     * @param {number} [rollNumber=1]
     * @param {string} [fullName='']
     * @param {string} [className='ม.6/1']
     */
    constructor(rollNumber = 1, fullName = "", className = "\u0E21.6/1") {
      this.rollNumber = validateRollNumber(rollNumber);
      this.fullName = fullName;
      this.className = className;
      this.state = EXAM_STATES.IDLE;
      this.attemptSeed = 0;
      this.durationSeconds = APP_CONFIG.examDurationSeconds;
      this.timeRemaining = this.durationSeconds;
      this.timerInterval = null;
      this.startTime = null;
      this.endTime = null;
      this.questions = [];
      this.userAnswers = {};
      this.examResult = null;
      this.restoredActiveQuestionIdx = 0;
      this.isRecoveredSession = false;
      this.recoveredAt = null;
      this.onTickCallback = null;
      this.onStateChangeCallback = null;
    }
    /**
     * Set student identity
     * @param {string} name
     * @param {string} room
     * @param {number} roll
     */
    setIdentity(name, room, roll) {
      this.fullName = name ? String(name).trim() : "";
      this.className = room ? String(room).trim() : "\u0E21.6/1";
      this.rollNumber = validateRollNumber(roll);
    }
    /**
     * Set student roll number
     * @param {number} newR
     */
    setRollNumber(newR) {
      this.rollNumber = validateRollNumber(newR);
    }
    /**
     * Start new 15-minute exam session
     * @param {number} [customSeed=null] - Optional attempt seed for testing/reproducibility
     */
    startExam(customSeed = null) {
      this.state = EXAM_STATES.IN_PROGRESS;
      this.timeRemaining = this.durationSeconds;
      this.startTime = Date.now();
      this.endTime = this.startTime + this.durationSeconds * 1e3;
      this.userAnswers = {};
      this.examResult = null;
      this.restoredActiveQuestionIdx = 0;
      this.isRecoveredSession = false;
      this.recoveredAt = null;
      this.attemptSeed = customSeed !== null ? customSeed : (Date.now() ^ Math.floor(Math.random() * 1e5)) >>> 0;
      LocalStorageAdapter.clearExamResult();
      this.questions = this._generateExamQuestions();
      this._saveSessionState();
      this._startTimer();
      if (this.onStateChangeCallback) {
        this.onStateChangeCallback(this.state);
      }
      return this.questions;
    }
    /**
     * Helper to persist current active exam state to storage adapter
     * @param {number} [activeQuestionIdx=0]
     */
    _saveSessionState(activeQuestionIdx = 0) {
      if (this.state !== EXAM_STATES.IN_PROGRESS) return;
      const lastQuestionIdx = Math.max(0, this.questions.length - 1);
      const normalizedQuestionIdx = Math.min(
        lastQuestionIdx,
        Math.max(0, Number.parseInt(activeQuestionIdx, 10) || 0)
      );
      LocalStorageAdapter.saveExamSession({
        status: "in-progress",
        fullName: this.fullName,
        className: this.className,
        rollNumber: this.rollNumber,
        attemptSeed: this.attemptSeed,
        startTime: this.startTime,
        endTime: this.endTime,
        durationSeconds: this.durationSeconds,
        lastSavedAt: Date.now(),
        questions: this.questions,
        userAnswers: this.userAnswers,
        activeQuestionIdx: normalizedQuestionIdx
      });
    }
    /**
     * Resume an existing in-progress exam session
     * @param {Object} sessionData
     * @returns {boolean} Success status
     */
    resumeExamSession(sessionData) {
      if (!sessionData || !Array.isArray(sessionData.questions) || sessionData.questions.length === 0) {
        return false;
      }
      const savedStartTime = Number(sessionData.startTime);
      const savedDurationSeconds = Number(sessionData.durationSeconds);
      const durationSeconds = Number.isFinite(savedDurationSeconds) && savedDurationSeconds > 0 ? savedDurationSeconds : this.durationSeconds;
      const savedEndTime = Number(sessionData.endTime);
      if (!Number.isFinite(savedStartTime)) {
        return false;
      }
      this.fullName = sessionData.fullName || this.fullName;
      this.className = sessionData.className || this.className;
      this.rollNumber = sessionData.rollNumber || this.rollNumber;
      this.attemptSeed = sessionData.attemptSeed || 0;
      this.durationSeconds = durationSeconds;
      this.startTime = savedStartTime;
      this.endTime = Number.isFinite(savedEndTime) ? savedEndTime : this.startTime + this.durationSeconds * 1e3;
      this.questions = sessionData.questions;
      this.userAnswers = sessionData.userAnswers || {};
      this.restoredActiveQuestionIdx = Math.min(
        this.questions.length - 1,
        Math.max(0, Number.parseInt(sessionData.activeQuestionIdx, 10) || 0)
      );
      this.isRecoveredSession = true;
      this.recoveredAt = Date.now();
      const timeRemainingSeconds = this._calculateTimeRemaining();
      if (timeRemainingSeconds <= 0) {
        this.state = EXAM_STATES.IN_PROGRESS;
        this.timeRemaining = 0;
        this.submitExam(true);
        return false;
      }
      this.state = EXAM_STATES.IN_PROGRESS;
      this.timeRemaining = timeRemainingSeconds;
      this._saveSessionState(this.restoredActiveQuestionIdx);
      this._startTimer();
      if (this.onStateChangeCallback) {
        this.onStateChangeCallback(this.state);
      }
      return true;
    }
    /**
     * Countdown timer tick
     */
    _startTimer() {
      if (this.timerInterval) clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => {
        this.syncTimeRemaining();
      }, 1e3);
    }
    /**
     * Recalculate the countdown from the persisted deadline.
     * This prevents refreshes, background throttling, or delayed intervals from granting extra time.
     * @returns {number} Remaining whole seconds
     */
    syncTimeRemaining() {
      if (this.state !== EXAM_STATES.IN_PROGRESS) return this.timeRemaining;
      this.timeRemaining = this._calculateTimeRemaining();
      if (this.onTickCallback) {
        this.onTickCallback(this.timeRemaining, this.formatTimerString());
      }
      if (this.timeRemaining <= 0) {
        this.submitExam(true);
      }
      return this.timeRemaining;
    }
    /**
     * Calculate remaining exam time from the original deadline.
     * @returns {number} Remaining whole seconds
     */
    _calculateTimeRemaining() {
      const millisecondsRemaining = this.endTime - Date.now();
      const secondsRemaining = Math.ceil(millisecondsRemaining / 1e3);
      return Math.min(this.durationSeconds, Math.max(0, secondsRemaining));
    }
    /**
     * Stop timer
     */
    _stopTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    }
    /**
     * Format remaining time into MM:SS string
     */
    formatTimerString() {
      const mins = Math.floor(Math.max(0, this.timeRemaining) / 60);
      const secs = Math.max(0, this.timeRemaining) % 60;
      const mm = String(mins).padStart(2, "0");
      const ss = String(secs).padStart(2, "0");
      return `${mm}:${ss}`;
    }
    /**
     * Record answer for a question
     * @param {number} questionIndex - 0..4
     * @param {any} answer
     * @param {number} [activeQuestionIdx=null]
     */
    recordAnswer(questionIndex, answer, activeQuestionIdx = null) {
      if (this.state !== EXAM_STATES.IN_PROGRESS) return;
      this.userAnswers[questionIndex] = answer;
      this._saveSessionState(activeQuestionIdx !== null ? activeQuestionIdx : questionIndex);
    }
    /**
     * Submit exam and compute final score out of 10
     * @param {boolean} [isAutoSubmit=false]
     */
    submitExam(isAutoSubmit = false) {
      if (this.state === EXAM_STATES.SUBMITTED || this.state === EXAM_STATES.REVIEW) {
        return this.examResult;
      }
      this._stopTimer();
      this.endTime = Date.now();
      this.state = EXAM_STATES.SUBMITTED;
      const timeTakenSeconds = Math.round((this.endTime - this.startTime) / 1e3);
      let totalScore = 0;
      const gradedQuestions = this.questions.map((q, idx) => {
        const uAns = this.userAnswers[idx];
        let isCorrect = false;
        let score = 0;
        if (q.type === "choice") {
          isCorrect = String(uAns) === String(q.correctChoiceIndex);
          score = isCorrect ? 2 : 0;
        } else {
          const evalResult = validateNumericAnswer(uAns, q.correctAnswer, 0.03);
          isCorrect = evalResult.isCorrect;
          score = isCorrect ? 2 : 0;
        }
        totalScore += score;
        return {
          ...q,
          userAnswer: uAns !== void 0 ? uAns : "\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E15\u0E2D\u0E1A",
          isCorrect,
          scoreObtained: score
        };
      });
      const now = /* @__PURE__ */ new Date();
      const thaiDateStr = now.toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" });
      const thaiTimeStr = now.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
      this.examResult = {
        fullName: this.fullName || "\u0E1C\u0E39\u0E49\u0E2A\u0E2D\u0E1A",
        className: this.className || "\u0E21.6/1",
        rollNumber: this.rollNumber,
        attemptSeed: this.attemptSeed,
        totalScore,
        maxScore: APP_CONFIG.examMaxScore,
        // 10
        percentage: totalScore / APP_CONFIG.examMaxScore * 100,
        timeTakenSeconds,
        formattedTimeTaken: `${Math.floor(timeTakenSeconds / 60)} \u0E19\u0E32\u0E17\u0E35 ${timeTakenSeconds % 60} \u0E27\u0E34\u0E19\u0E32\u0E17\u0E35`,
        submittedAt: now.toISOString(),
        formattedSubmittedAt: `${thaiDateStr} \u0E40\u0E27\u0E25\u0E32 ${thaiTimeStr} \u0E19.`,
        isAutoSubmit,
        gradedQuestions
      };
      LocalStorageAdapter.saveExamResult(this.examResult);
      LocalStorageAdapter.clearExamSession();
      if (this.onStateChangeCallback) {
        this.onStateChangeCallback(this.state, this.examResult);
      }
      return this.examResult;
    }
    /**
     * Generate 5 randomized exam questions (1 Choice + 4 Numeric)
     * Dynamic RNG system that randomizes question variations & physical parameters
     * every time a learner starts an exam.
     */
    _generateExamQuestions() {
      const R = this.rollNumber;
      const B = this.attemptSeed;
      const theoryPool = [
        {
          problemText: "\u0E02\u0E49\u0E2D\u0E43\u0E14\u0E15\u0E48\u0E2D\u0E44\u0E1B\u0E19\u0E35\u0E49\u0E01\u0E25\u0E48\u0E32\u0E27\u0E16\u0E36\u0E07\u0E2A\u0E21\u0E1A\u0E31\u0E15\u0E34\u0E02\u0E2D\u0E07\u0E04\u0E25\u0E37\u0E48\u0E19\u0E41\u0E21\u0E48\u0E40\u0E2B\u0E25\u0E47\u0E01\u0E44\u0E1F\u0E1F\u0E49\u0E32 **\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07**",
          choices: [
            "\u0E40\u0E1B\u0E47\u0E19\u0E04\u0E25\u0E37\u0E48\u0E19\u0E15\u0E32\u0E21\u0E02\u0E27\u0E32\u0E07\u0E17\u0E35\u0E48\u0E2A\u0E19\u0E32\u0E21\u0E44\u0E1F\u0E1F\u0E49\u0E32\u0E41\u0E25\u0E30\u0E2A\u0E19\u0E32\u0E21\u0E41\u0E21\u0E48\u0E40\u0E2B\u0E25\u0E47\u0E01\u0E15\u0E31\u0E49\u0E07\u0E09\u0E32\u0E01\u0E01\u0E31\u0E19\u0E41\u0E25\u0E30\u0E15\u0E31\u0E49\u0E07\u0E09\u0E32\u0E01\u0E01\u0E31\u0E1A\u0E17\u0E34\u0E28\u0E01\u0E32\u0E23\u0E41\u0E1C\u0E48 (\\(\\vec{E} \\perp \\vec{B} \\perp \\vec{v}\\))",
            "\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E40\u0E04\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E17\u0E35\u0E48\u0E1C\u0E48\u0E32\u0E19\u0E2A\u0E38\u0E0D\u0E0D\u0E32\u0E01\u0E32\u0E28\u0E44\u0E14\u0E49\u0E14\u0E49\u0E27\u0E22\u0E2D\u0E31\u0E15\u0E23\u0E32\u0E40\u0E23\u0E47\u0E27\u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E1A\u0E2D\u0E31\u0E15\u0E23\u0E32\u0E40\u0E23\u0E47\u0E27\u0E41\u0E2A\u0E07 \\(c\\)",
            "\u0E08\u0E33\u0E40\u0E1B\u0E47\u0E19\u0E15\u0E49\u0E2D\u0E07\u0E2D\u0E32\u0E28\u0E31\u0E22\u0E15\u0E31\u0E27\u0E01\u0E25\u0E32\u0E07\u0E17\u0E35\u0E48\u0E21\u0E35\u0E21\u0E27\u0E25\u0E43\u0E19\u0E01\u0E32\u0E23\u0E2A\u0E48\u0E07\u0E1C\u0E48\u0E32\u0E19\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19",
            "\u0E40\u0E27\u0E01\u0E40\u0E15\u0E2D\u0E23\u0E4C\u0E2A\u0E19\u0E32\u0E21\u0E44\u0E1F\u0E1F\u0E49\u0E32 \\(\\vec{E}\\) \u0E41\u0E25\u0E30\u0E2A\u0E19\u0E32\u0E21\u0E41\u0E21\u0E48\u0E40\u0E2B\u0E25\u0E47\u0E01 \\(\\vec{B}\\) \u0E21\u0E35\u0E40\u0E1F\u0E2A\u0E15\u0E23\u0E07\u0E01\u0E31\u0E19\u0E17\u0E38\u0E01\u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07"
          ],
          correctChoiceIndex: 2,
          explanation: '\u0E04\u0E25\u0E37\u0E48\u0E19\u0E41\u0E21\u0E48\u0E40\u0E2B\u0E25\u0E47\u0E01\u0E44\u0E1F\u0E1F\u0E49\u0E32\u0E40\u0E1B\u0E47\u0E19\u0E04\u0E25\u0E37\u0E48\u0E19\u0E44\u0E21\u0E48\u0E2D\u0E32\u0E28\u0E31\u0E22\u0E15\u0E31\u0E27\u0E01\u0E25\u0E32\u0E07 \u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E40\u0E04\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E17\u0E35\u0E48\u0E1C\u0E48\u0E32\u0E19\u0E2A\u0E38\u0E0D\u0E0D\u0E32\u0E01\u0E32\u0E28\u0E44\u0E14\u0E49\u0E14\u0E49\u0E27\u0E22\u0E2D\u0E31\u0E15\u0E23\u0E32\u0E40\u0E23\u0E47\u0E27 \\(c\\) \u0E01\u0E32\u0E23\u0E01\u0E25\u0E48\u0E32\u0E27\u0E27\u0E48\u0E32 "\u0E08\u0E33\u0E40\u0E1B\u0E47\u0E19\u0E15\u0E49\u0E2D\u0E07\u0E2D\u0E32\u0E28\u0E31\u0E22\u0E15\u0E31\u0E27\u0E01\u0E25\u0E32\u0E07" \u0E08\u0E36\u0E07\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07'
        },
        {
          problemText: "\u0E02\u0E49\u0E2D\u0E43\u0E14\u0E40\u0E23\u0E35\u0E22\u0E07\u0E25\u0E33\u0E14\u0E31\u0E1A\u0E04\u0E25\u0E37\u0E48\u0E19\u0E41\u0E21\u0E48\u0E40\u0E2B\u0E25\u0E47\u0E01\u0E44\u0E1F\u0E1F\u0E49\u0E32\u0E08\u0E32\u0E01 **\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19\u0E21\u0E32\u0E01\u0E44\u0E1B\u0E19\u0E49\u0E2D\u0E22** \u0E44\u0E14\u0E49\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07",
          choices: [
            "\u0E23\u0E31\u0E07\u0E2A\u0E35\u0E41\u0E01\u0E21\u0E21\u0E32 \u2192 \u0E23\u0E31\u0E07\u0E2A\u0E35\u0E40\u0E2D\u0E47\u0E01\u0E0B\u0E4C \u2192 \u0E41\u0E2A\u0E07\u0E02\u0E32\u0E27 \u2192 \u0E04\u0E25\u0E37\u0E48\u0E19\u0E27\u0E34\u0E17\u0E22\u0E38",
            "\u0E04\u0E25\u0E37\u0E48\u0E19\u0E27\u0E34\u0E17\u0E22\u0E38 \u2192 \u0E44\u0E21\u0E42\u0E04\u0E23\u0E40\u0E27\u0E1F \u2192 \u0E2D\u0E34\u0E19\u0E1F\u0E23\u0E32\u0E40\u0E23\u0E14 \u2192 \u0E23\u0E31\u0E07\u0E2A\u0E35\u0E2D\u0E31\u0E25\u0E15\u0E23\u0E32\u0E44\u0E27\u0E42\u0E2D\u0E40\u0E25\u0E15",
            "\u0E2D\u0E34\u0E19\u0E1F\u0E23\u0E32\u0E40\u0E23\u0E14 \u2192 \u0E04\u0E25\u0E37\u0E48\u0E19\u0E27\u0E34\u0E17\u0E22\u0E38 \u2192 \u0E44\u0E21\u0E42\u0E04\u0E23\u0E40\u0E27\u0E1F \u2192 \u0E23\u0E31\u0E07\u0E2A\u0E35\u0E40\u0E2D\u0E47\u0E01\u0E0B\u0E4C",
            "\u0E23\u0E31\u0E07\u0E2A\u0E35\u0E2D\u0E31\u0E25\u0E15\u0E23\u0E32\u0E44\u0E27\u0E42\u0E2D\u0E40\u0E25\u0E15 \u2192 \u0E41\u0E2A\u0E07\u0E02\u0E32\u0E27 \u2192 \u0E2D\u0E34\u0E19\u0E1F\u0E23\u0E32\u0E40\u0E23\u0E14 \u2192 \u0E04\u0E25\u0E37\u0E48\u0E19\u0E27\u0E34\u0E17\u0E22\u0E38"
          ],
          correctChoiceIndex: 1,
          explanation: "\u0E04\u0E25\u0E37\u0E48\u0E19\u0E27\u0E34\u0E17\u0E22\u0E38\u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19\u0E21\u0E32\u0E01\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14 \u0E16\u0E31\u0E14\u0E21\u0E32\u0E40\u0E1B\u0E47\u0E19\u0E44\u0E21\u0E42\u0E04\u0E23\u0E40\u0E27\u0E1F \u0E2D\u0E34\u0E19\u0E1F\u0E23\u0E32\u0E40\u0E23\u0E14 \u0E41\u0E25\u0E30\u0E2D\u0E31\u0E25\u0E15\u0E23\u0E32\u0E44\u0E27\u0E42\u0E2D\u0E40\u0E25\u0E15\u0E15\u0E32\u0E21\u0E25\u0E33\u0E14\u0E31\u0E1A"
        },
        {
          problemText: "\u0E02\u0E49\u0E2D\u0E43\u0E14\u0E40\u0E23\u0E35\u0E22\u0E07\u0E25\u0E33\u0E14\u0E31\u0E1A\u0E04\u0E25\u0E37\u0E48\u0E19\u0E41\u0E21\u0E48\u0E40\u0E2B\u0E25\u0E47\u0E01\u0E44\u0E1F\u0E1F\u0E49\u0E32\u0E08\u0E32\u0E01 **\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19\u0E19\u0E49\u0E2D\u0E22\u0E44\u0E1B\u0E21\u0E32\u0E01** \u0E44\u0E14\u0E49\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07",
          choices: [
            "\u0E04\u0E25\u0E37\u0E48\u0E19\u0E27\u0E34\u0E17\u0E22\u0E38 \u2192 \u0E44\u0E21\u0E42\u0E04\u0E23\u0E40\u0E27\u0E1F \u2192 \u0E2D\u0E34\u0E19\u0E1F\u0E23\u0E32\u0E40\u0E23\u0E14 \u2192 \u0E23\u0E31\u0E07\u0E2A\u0E35\u0E2D\u0E31\u0E25\u0E15\u0E23\u0E32\u0E44\u0E27\u0E42\u0E2D\u0E40\u0E25\u0E15",
            "\u0E23\u0E31\u0E07\u0E2A\u0E35\u0E41\u0E01\u0E21\u0E21\u0E32 \u2192 \u0E23\u0E31\u0E07\u0E2A\u0E35\u0E40\u0E2D\u0E47\u0E01\u0E0B\u0E4C \u2192 \u0E23\u0E31\u0E07\u0E2A\u0E35\u0E2D\u0E31\u0E25\u0E15\u0E23\u0E32\u0E44\u0E27\u0E42\u0E2D\u0E40\u0E25\u0E15 \u2192 \u0E2D\u0E34\u0E19\u0E1F\u0E23\u0E32\u0E40\u0E23\u0E14",
            "\u0E2D\u0E34\u0E19\u0E1F\u0E23\u0E32\u0E40\u0E23\u0E14 \u2192 \u0E41\u0E2A\u0E07\u0E02\u0E32\u0E27 \u2192 \u0E23\u0E31\u0E07\u0E2A\u0E35\u0E40\u0E2D\u0E47\u0E01\u0E0B\u0E4C \u2192 \u0E23\u0E31\u0E07\u0E2A\u0E35\u0E41\u0E01\u0E21\u0E21\u0E32",
            "\u0E44\u0E21\u0E42\u0E04\u0E23\u0E40\u0E27\u0E1F \u2192 \u0E2D\u0E34\u0E19\u0E1F\u0E23\u0E32\u0E40\u0E23\u0E14 \u2192 \u0E04\u0E25\u0E37\u0E48\u0E19\u0E27\u0E34\u0E17\u0E22\u0E38 \u2192 \u0E23\u0E31\u0E07\u0E2A\u0E35\u0E40\u0E2D\u0E47\u0E01\u0E0B\u0E4C"
          ],
          correctChoiceIndex: 1,
          explanation: "\u0E40\u0E23\u0E35\u0E22\u0E07\u0E25\u0E33\u0E14\u0E31\u0E1A\u0E08\u0E32\u0E01\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19\u0E19\u0E49\u0E2D\u0E22\u0E44\u0E1B\u0E21\u0E32\u0E01 (\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E2A\u0E39\u0E07\u0E44\u0E1B\u0E15\u0E48\u0E33) \u0E44\u0E14\u0E49\u0E41\u0E01\u0E48: \u0E23\u0E31\u0E07\u0E2A\u0E35\u0E41\u0E01\u0E21\u0E21\u0E32 \u2192 \u0E23\u0E31\u0E07\u0E2A\u0E35\u0E40\u0E2D\u0E47\u0E01\u0E0B\u0E4C \u2192 \u0E23\u0E31\u0E07\u0E2A\u0E35\u0E2D\u0E31\u0E25\u0E15\u0E23\u0E32\u0E44\u0E27\u0E42\u0E2D\u0E40\u0E25\u0E15 \u2192 \u0E2D\u0E34\u0E19\u0E1F\u0E23\u0E32\u0E40\u0E23\u0E14 \u2192 \u0E04\u0E25\u0E37\u0E48\u0E19\u0E44\u0E21\u0E42\u0E04\u0E23\u0E40\u0E27\u0E1F \u2192 \u0E04\u0E25\u0E37\u0E48\u0E19\u0E27\u0E34\u0E17\u0E22\u0E38"
        }
      ];
      const selectedTheory = getSeededChoice(R, 1, theoryPool, B);
      const shuffledTheoryChoices = getSeededShuffle(
        R,
        101,
        selectedTheory.choices.map((choiceText, originalIdx) => ({
          choiceText,
          isCorrect: originalIdx === selectedTheory.correctChoiceIndex
        })),
        B
      );
      const q1 = {
        id: "exam_q1",
        type: "choice",
        topic: "18.1 \u0E17\u0E24\u0E29\u0E0E\u0E35\u0E04\u0E25\u0E37\u0E48\u0E19\u0E41\u0E21\u0E48\u0E40\u0E2B\u0E25\u0E47\u0E01\u0E44\u0E1F\u0E1F\u0E49\u0E32",
        title: "\u0E02\u0E49\u0E2D 1: \u0E17\u0E24\u0E29\u0E0E\u0E35\u0E04\u0E25\u0E37\u0E48\u0E19\u0E41\u0E21\u0E48\u0E40\u0E2B\u0E25\u0E47\u0E01\u0E44\u0E1F\u0E1F\u0E49\u0E32",
        problemText: selectedTheory.problemText,
        choices: shuffledTheoryChoices.map(({ choiceText }) => choiceText),
        correctChoiceIndex: shuffledTheoryChoices.findIndex(({ isCorrect }) => isCorrect),
        solutionSteps: [`**\u0E04\u0E33\u0E2D\u0E18\u0E34\u0E1A\u0E32\u0E22**: ${selectedTheory.explanation}`]
      };
      const pool181 = [
        () => {
          const freqMHz = getDynamicParam(R, 80, 1.5, 15, { min: 50, max: 400, decimals: 1 }, B);
          const freqHz = freqMHz * 1e6;
          const lambda = calculateWavelength(freqHz);
          return {
            id: "exam_q2",
            type: "numeric",
            topic: "18.1 \u0E01\u0E32\u0E23\u0E04\u0E33\u0E19\u0E27\u0E13\u0E2D\u0E31\u0E15\u0E23\u0E32\u0E40\u0E23\u0E47\u0E27\u0E41\u0E25\u0E30\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19",
            title: "\u0E02\u0E49\u0E2D 2: \u0E04\u0E33\u0E19\u0E27\u0E13\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19\u0E27\u0E34\u0E17\u0E22\u0E38",
            problemText: `\u0E40\u0E2A\u0E32\u0E2A\u0E48\u0E07\u0E2A\u0E31\u0E0D\u0E0D\u0E32\u0E13\u0E27\u0E34\u0E17\u0E22\u0E38\u0E2A\u0E48\u0E07\u0E04\u0E25\u0E37\u0E48\u0E19\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48 \\(f = ${freqMHz.toFixed(1)} \\text{ MHz}\\) \u0E43\u0E19\u0E2A\u0E38\u0E0D\u0E0D\u0E32\u0E01\u0E32\u0E28 (\\(c = 3.00 \\times 10^8 \\text{ m/s}\\)) \u0E08\u0E07\u0E2B\u0E32\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19 (\\(\\lambda\\)) \u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E40\u0E21\u0E15\u0E23 (m)`,
            unit: "m",
            correctAnswer: Math.round(lambda * 100) / 100,
            solutionSteps: [
              `\\(\\lambda = \\frac{c}{f} = \\frac{3.00 \\times 10^8}{${formatLatexScientific(freqHz)}} = ${lambda.toFixed(2)} \\text{ m}\\)`
            ]
          };
        },
        () => {
          const lambdaM = getDynamicParam(R, 1.2, 0.05, 0.8, { min: 0.5, max: 6, decimals: 2 }, B);
          const freqHz = calculateFrequency(lambdaM);
          const freqMHz = freqHz / 1e6;
          return {
            id: "exam_q2",
            type: "numeric",
            topic: "18.1 \u0E01\u0E32\u0E23\u0E04\u0E33\u0E19\u0E27\u0E13\u0E2D\u0E31\u0E15\u0E23\u0E32\u0E40\u0E23\u0E47\u0E27\u0E41\u0E25\u0E30\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19",
            title: "\u0E02\u0E49\u0E2D 2: \u0E04\u0E33\u0E19\u0E27\u0E13\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E08\u0E32\u0E01\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19",
            problemText: `\u0E04\u0E25\u0E37\u0E48\u0E19\u0E41\u0E21\u0E48\u0E40\u0E2B\u0E25\u0E47\u0E01\u0E44\u0E1F\u0E1F\u0E49\u0E32\u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19 \\(\\lambda = ${lambdaM.toFixed(2)} \\text{ m}\\) \u0E40\u0E04\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E17\u0E35\u0E48\u0E43\u0E19\u0E2A\u0E38\u0E0D\u0E0D\u0E32\u0E01\u0E32\u0E28 (\\(c = 3.00 \\times 10^8 \\text{ m/s}\\)) \u0E08\u0E07\u0E04\u0E33\u0E19\u0E27\u0E13\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E02\u0E2D\u0E07\u0E04\u0E25\u0E37\u0E48\u0E19\u0E19\u0E35\u0E49\u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E40\u0E21\u0E01\u0E30\u0E40\u0E2E\u0E34\u0E23\u0E15\u0E0B\u0E4C (MHz)`,
            unit: "MHz",
            correctAnswer: Math.round(freqMHz * 100) / 100,
            solutionSteps: [
              `\\(f = \\frac{c}{\\lambda} = \\frac{3.00 \\times 10^8}{${lambdaM.toFixed(2)}} = ${formatLatexScientific(freqHz)} \\text{ Hz}\\)`,
              `\u0E41\u0E1B\u0E25\u0E07\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E40\u0E1B\u0E47\u0E19 MHz: \\(f_{\\text{MHz}} = \\frac{${formatLatexScientific(freqHz)}}{10^6} = ${freqMHz.toFixed(2)} \\text{ MHz}\\)`
            ]
          };
        },
        () => {
          const freqMHz = getDynamicParam(R, 90, 2, 20, { min: 80, max: 500, decimals: 1 }, B);
          const freqHz = freqMHz * 1e6;
          const lambda = calculateWavelength(freqHz);
          const antennaL = lambda / 2;
          return {
            id: "exam_q2",
            type: "numeric",
            topic: "18.1 \u0E2A\u0E32\u0E22\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E04\u0E23\u0E36\u0E48\u0E07\u0E04\u0E25\u0E37\u0E48\u0E19",
            title: "\u0E02\u0E49\u0E2D 2: \u0E04\u0E33\u0E19\u0E27\u0E13\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E2A\u0E32\u0E22\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E44\u0E14\u0E42\u0E1E\u0E25",
            problemText: `\u0E2A\u0E32\u0E22\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E41\u0E1A\u0E1A\u0E44\u0E14\u0E42\u0E1E\u0E25\u0E04\u0E23\u0E36\u0E48\u0E07\u0E04\u0E25\u0E37\u0E48\u0E19 (Half-wave Dipole) \u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E1A \\(L = \\frac{\\lambda}{2}\\) \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E23\u0E31\u0E1A\u0E04\u0E25\u0E37\u0E48\u0E19\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48 \\(f = ${freqMHz.toFixed(1)} \\text{ MHz}\\) \u0E43\u0E19\u0E2A\u0E38\u0E0D\u0E0D\u0E32\u0E01\u0E32\u0E28 \u0E08\u0E07\u0E2B\u0E32\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E02\u0E2D\u0E07\u0E2A\u0E32\u0E22\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E19\u0E35\u0E49\u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E40\u0E21\u0E15\u0E23 (m)`,
            unit: "m",
            correctAnswer: Math.round(antennaL * 100) / 100,
            solutionSteps: [
              `\\(\\lambda = \\frac{c}{f} = \\frac{3.00 \\times 10^8}{${formatLatexScientific(freqHz)}} = ${lambda.toFixed(2)} \\text{ m}\\)`,
              `\\(L = \\frac{\\lambda}{2} = \\frac{${lambda.toFixed(2)}}{2} = ${antennaL.toFixed(2)} \\text{ m}\\)`
            ]
          };
        }
      ];
      const q2Generator = getSeededChoice(R, 2, pool181, B);
      const q2 = q2Generator();
      const pool182 = [
        () => {
          const freqFactor = getDynamicParam(R, 4, 0.05, 1.5, { min: 2, max: 9, decimals: 2 }, B + 1);
          const freqHz3 = freqFactor * 1e14;
          const energyObj = calculatePhotonEnergy(freqHz3);
          return {
            id: "exam_q3",
            type: "numeric",
            topic: "18.2 \u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E42\u0E1F\u0E15\u0E2D\u0E19\u0E2A\u0E40\u0E1B\u0E01\u0E15\u0E23\u0E31\u0E21",
            title: "\u0E02\u0E49\u0E2D 3: \u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E42\u0E1F\u0E15\u0E2D\u0E19\u0E43\u0E19\u0E22\u0E48\u0E32\u0E19\u0E41\u0E2A\u0E07",
            problemText: `\u0E42\u0E1F\u0E15\u0E2D\u0E19\u0E02\u0E2D\u0E07\u0E41\u0E2A\u0E07\u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48 \\(f = ${freqFactor.toFixed(2)} \\times 10^{14} \\text{ Hz}\\) \u0E08\u0E07\u0E2B\u0E32\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E42\u0E1F\u0E15\u0E2D\u0E19\u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E42\u0E27\u0E25\u0E15\u0E4C (eV) \u0E01\u0E33\u0E2B\u0E19\u0E14\u0E43\u0E2B\u0E49 \\(h = 6.626 \\times 10^{-34} \\text{ J}\\cdot\\text{s}\\) \u0E41\u0E25\u0E30 \\(1 \\text{ eV} = 1.602 \\times 10^{-19} \\text{ J}\\)`,
            unit: "eV",
            correctAnswer: Math.round(energyObj.electronVolts * 100) / 100,
            solutionSteps: [
              `\\(E = hf = (6.626 \\times 10^{-34}) \\times (${freqFactor.toFixed(2)} \\times 10^{14}) = ${formatLatexScientific(energyObj.joules)} \\text{ J}\\)`,
              `\\(E_{\\text{eV}} = \\frac{${formatLatexScientific(energyObj.joules)}}{1.602 \\times 10^{-19}} = ${energyObj.electronVolts.toFixed(2)} \\text{ eV}\\)`
            ]
          };
        },
        () => {
          const energyEV = getDynamicParam(R, 1.8, 0.05, 0.8, { min: 1.5, max: 4.5, decimals: 2 }, B + 1);
          const energyJ = energyEV * 1602e-22;
          const freqHz = energyJ / 6626e-37;
          const freqFactor = freqHz / 1e14;
          return {
            id: "exam_q3",
            type: "numeric",
            topic: "18.2 \u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E42\u0E1F\u0E15\u0E2D\u0E19\u0E2A\u0E40\u0E1B\u0E01\u0E15\u0E23\u0E31\u0E21",
            title: "\u0E02\u0E49\u0E2D 3: \u0E04\u0E33\u0E19\u0E27\u0E13\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E08\u0E32\u0E01\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E42\u0E1F\u0E15\u0E2D\u0E19",
            problemText: `\u0E2D\u0E19\u0E38\u0E20\u0E32\u0E04\u0E42\u0E1F\u0E15\u0E2D\u0E19\u0E21\u0E35\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19 \\(E = ${energyEV.toFixed(2)} \\text{ eV}\\) \u0E08\u0E07\u0E04\u0E33\u0E19\u0E27\u0E13\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48\u0E02\u0E2D\u0E07\u0E04\u0E25\u0E37\u0E48\u0E19\u0E19\u0E35\u0E49\u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22 \\(\\times 10^{14} \\text{ Hz}\\) (\u0E15\u0E2D\u0E1A\u0E40\u0E09\u0E1E\u0E32\u0E30\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E2A\u0E31\u0E21\u0E1E\u0E31\u0E17\u0E18\u0E4C\u0E2B\u0E19\u0E49\u0E32 \\(10^{14}\\)) \u0E01\u0E33\u0E2B\u0E19\u0E14\u0E43\u0E2B\u0E49 \\(h = 6.626 \\times 10^{-34} \\text{ J}\\cdot\\text{s}\\) \u0E41\u0E25\u0E30 \\(1 \\text{ eV} = 1.602 \\times 10^{-19} \\text{ J}\\)`,
            unit: "x10^14 Hz",
            correctAnswer: Math.round(freqFactor * 100) / 100,
            solutionSteps: [
              `\\(E_{\\text{J}} = ${energyEV.toFixed(2)} \\times 1.602 \\times 10^{-19} = ${formatLatexScientific(energyJ)} \\text{ J}\\)`,
              `\\(f = \\frac{E}{h} = \\frac{${formatLatexScientific(energyJ)}}{6.626 \\times 10^{-34}} = ${freqFactor.toFixed(2)} \\times 10^{14} \\text{ Hz}\\)`
            ]
          };
        },
        () => {
          const lambdaNm = getDynamicParam(R, 420, 5, 60, { min: 400, max: 700, decimals: 0 }, B + 1);
          const lambdaM = lambdaNm * 1e-9;
          const freqHz = 3e8 / lambdaM;
          const energyObj = calculatePhotonEnergy(freqHz);
          return {
            id: "exam_q3",
            type: "numeric",
            topic: "18.2 \u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E42\u0E1F\u0E15\u0E2D\u0E19\u0E2A\u0E40\u0E1B\u0E01\u0E15\u0E23\u0E31\u0E21",
            title: "\u0E02\u0E49\u0E2D 3: \u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E42\u0E1F\u0E15\u0E2D\u0E19\u0E08\u0E32\u0E01\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19",
            problemText: `\u0E04\u0E25\u0E37\u0E48\u0E19\u0E41\u0E2A\u0E07\u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19 \\(\\lambda = ${Math.round(lambdaNm)} \\text{ nm}\\) \u0E43\u0E19\u0E2A\u0E38\u0E0D\u0E0D\u0E32\u0E01\u0E32\u0E28 \u0E08\u0E07\u0E04\u0E33\u0E19\u0E27\u0E13\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E02\u0E2D\u0E07\u0E42\u0E1F\u0E15\u0E2D\u0E19\u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E15\u0E23\u0E2D\u0E19\u0E42\u0E27\u0E25\u0E15\u0E4C (eV) \u0E01\u0E33\u0E2B\u0E19\u0E14\u0E43\u0E2B\u0E49 \\(h = 6.626 \\times 10^{-34} \\text{ J}\\cdot\\text{s}\\), \\(c = 3.00 \\times 10^8 \\text{ m/s}\\) \u0E41\u0E25\u0E30 \\(1 \\text{ eV} = 1.602 \\times 10^{-19} \\text{ J}\\)`,
            unit: "eV",
            correctAnswer: Math.round(energyObj.electronVolts * 100) / 100,
            solutionSteps: [
              `\\(f = \\frac{c}{\\lambda} = \\frac{3.00 \\times 10^8}{${Math.round(lambdaNm)} \\times 10^{-9}} = ${formatLatexScientific(freqHz)} \\text{ Hz}\\)`,
              `\\(E_{\\text{eV}} = \\frac{hf}{1.602 \\times 10^{-19}} = ${energyObj.electronVolts.toFixed(2)} \\text{ eV}\\)`
            ]
          };
        }
      ];
      const q3Generator = getSeededChoice(R, 3, pool182, B + 1);
      const q3 = q3Generator();
      const pool183 = [
        () => {
          const standardAngles = [0, 30, 45, 60, 90];
          const angleDeg = getSeededChoice(R, 4, standardAngles, B + 2);
          const I1 = 50;
          const I2 = calculateMalusIntensity(I1, angleDeg);
          return {
            id: "exam_q4",
            type: "numeric",
            topic: "18.3 \u0E01\u0E0E\u0E02\u0E2D\u0E07\u0E21\u0E32\u0E25\u0E38\u0E2A\u0E41\u0E25\u0E30\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E41\u0E2A\u0E07",
            title: "\u0E02\u0E49\u0E2D 4: \u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E41\u0E2A\u0E07\u0E1C\u0E48\u0E32\u0E19\u0E41\u0E1C\u0E48\u0E19\u0E42\u0E1E\u0E25\u0E32\u0E23\u0E2D\u0E22\u0E14\u0E4C",
            problemText: `\u0E41\u0E2A\u0E07\u0E44\u0E21\u0E48\u0E42\u0E1E\u0E25\u0E32\u0E44\u0E23\u0E2A\u0E4C\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E40\u0E23\u0E34\u0E48\u0E21\u0E15\u0E49\u0E19 \\(I_0 = 100\\%\\) \u0E1C\u0E48\u0E32\u0E19\u0E41\u0E1C\u0E48\u0E19 Polarizer P1 \u0E41\u0E25\u0E30 Analyzer P2 \u0E17\u0E33\u0E21\u0E38\u0E21 \\(\\theta = ${angleDeg}^\\circ\\) \u0E08\u0E07\u0E2B\u0E32\u0E23\u0E49\u0E2D\u0E22\u0E25\u0E30\u0E02\u0E2D\u0E07\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E41\u0E2A\u0E07\u0E17\u0E35\u0E48\u0E2A\u0E48\u0E2D\u0E07\u0E1C\u0E48\u0E32\u0E19\u0E2D\u0E2D\u0E01\u0E2B\u0E25\u0E31\u0E07\u0E08\u0E32\u0E01\u0E41\u0E1C\u0E48\u0E19 P2 (\\(I_2\\))`,
            unit: "%",
            correctAnswer: Math.round(I2 * 100) / 100,
            solutionSteps: [
              `\\(I_1 = \\frac{1}{2}I_0 = \\frac{100}{2} = 50\\%\\)`,
              `\\(I_2 = I_1 \\cos^2(${angleDeg}^\\circ) = 50 \\times \\cos^2(${angleDeg}^\\circ) = ${I2.toFixed(2)}\\%\\)`
            ]
          };
        },
        () => {
          const standardAngles = [0, 30, 45, 60, 90];
          const angleDeg = getSeededChoice(R, 4, standardAngles, B + 2);
          const I1 = 100;
          const I2 = calculateMalusIntensity(I1, angleDeg);
          return {
            id: "exam_q4",
            type: "numeric",
            topic: "18.3 \u0E01\u0E0E\u0E02\u0E2D\u0E07\u0E21\u0E32\u0E25\u0E38\u0E2A\u0E41\u0E25\u0E30\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E41\u0E2A\u0E07",
            title: "\u0E02\u0E49\u0E2D 4: \u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E41\u0E2A\u0E07\u0E42\u0E1E\u0E25\u0E32\u0E44\u0E23\u0E2A\u0E4C\u0E1C\u0E48\u0E32\u0E19 Analyzer",
            problemText: `\u0E41\u0E2A\u0E07\u0E42\u0E1E\u0E25\u0E32\u0E44\u0E23\u0E2A\u0E4C\u0E40\u0E0A\u0E34\u0E07\u0E40\u0E2A\u0E49\u0E19\u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21 \\(I_1 = 100 \\text{ W/m}^2\\) \u0E15\u0E01\u0E01\u0E23\u0E30\u0E17\u0E1A\u0E41\u0E1C\u0E48\u0E19\u0E41\u0E2D\u0E19\u0E32\u0E44\u0E25\u0E40\u0E0B\u0E2D\u0E23\u0E4C P2 \u0E0B\u0E36\u0E48\u0E07\u0E17\u0E33\u0E21\u0E38\u0E21 \\(\\theta = ${angleDeg}^\\circ\\) \u0E01\u0E31\u0E1A\u0E41\u0E19\u0E27\u0E42\u0E1E\u0E25\u0E32\u0E44\u0E23\u0E0B\u0E4C \u0E08\u0E07\u0E2B\u0E32\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E41\u0E2A\u0E07\u0E17\u0E35\u0E48\u0E17\u0E30\u0E25\u0E38\u0E1C\u0E48\u0E32\u0E19 P2 (\\(I_2\\)) \u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22 \\(\\text{W/m}^2\\)`,
            unit: "W/m^2",
            correctAnswer: Math.round(I2 * 100) / 100,
            solutionSteps: [
              `\\(I_2 = I_1 \\cos^2\\theta = 100 \\times \\cos^2(${angleDeg}^\\circ) = ${I2.toFixed(2)} \\text{ W/m}^2\\)`
            ]
          };
        },
        () => {
          const standardAngles = [0, 30, 45, 60, 90];
          const angleDeg = getSeededChoice(R, 4, standardAngles, B + 2);
          const I0 = 80;
          const I1 = I0 / 2;
          const I2 = calculateMalusIntensity(I1, angleDeg);
          return {
            id: "exam_q4",
            type: "numeric",
            topic: "18.3 \u0E01\u0E0E\u0E02\u0E2D\u0E07\u0E21\u0E32\u0E25\u0E38\u0E2A\u0E41\u0E25\u0E30\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E41\u0E2A\u0E07",
            title: "\u0E02\u0E49\u0E2D 4: \u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E41\u0E2A\u0E07\u0E40\u0E23\u0E34\u0E48\u0E21\u0E15\u0E49\u0E19 80% \u0E1C\u0E48\u0E32\u0E19\u0E41\u0E1C\u0E48\u0E19\u0E42\u0E1E\u0E25\u0E32\u0E23\u0E2D\u0E22\u0E14\u0E4C",
            problemText: `\u0E25\u0E33\u0E41\u0E2A\u0E07\u0E44\u0E21\u0E48\u0E42\u0E1E\u0E25\u0E32\u0E44\u0E23\u0E2A\u0E4C\u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E40\u0E23\u0E34\u0E48\u0E21\u0E15\u0E49\u0E19 \\(I_0 = 80\\%\\) \u0E1C\u0E48\u0E32\u0E19\u0E41\u0E1C\u0E48\u0E19\u0E42\u0E1E\u0E25\u0E32\u0E23\u0E2D\u0E22\u0E14\u0E4C P1 \u0E41\u0E25\u0E30 P2 \u0E17\u0E33\u0E21\u0E38\u0E21 \\(\\theta = ${angleDeg}^\\circ\\) \u0E08\u0E07\u0E04\u0E33\u0E19\u0E27\u0E13\u0E23\u0E49\u0E2D\u0E22\u0E25\u0E30\u0E02\u0E2D\u0E07\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E41\u0E2A\u0E07\u0E17\u0E35\u0E48\u0E2A\u0E48\u0E2D\u0E07\u0E1C\u0E48\u0E32\u0E19\u0E41\u0E1C\u0E48\u0E19 P2 (\\(I_2\\))`,
            unit: "%",
            correctAnswer: Math.round(I2 * 100) / 100,
            solutionSteps: [
              `\\(I_1 = \\frac{1}{2}I_0 = \\frac{80}{2} = 40\\%\\)`,
              `\\(I_2 = I_1 \\cos^2(${angleDeg}^\\circ) = 40 \\times \\cos^2(${angleDeg}^\\circ) = ${I2.toFixed(2)}\\%\\)`
            ]
          };
        }
      ];
      const q4Generator = getSeededChoice(R, 4, pool183, B + 2);
      const q4 = q4Generator();
      const freq5MHz = getDynamicParam(R, 85, 1.5, 15, { min: 50, max: 400, decimals: 1 }, B + 3);
      const freq5Hz = freq5MHz * 1e6;
      const lambda5 = calculateWavelength(freq5Hz);
      const antennaLen = lambda5 / 4;
      const q5 = {
        id: "exam_q5",
        type: "numeric",
        topic: "18.1 \u0E2A\u0E32\u0E22\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E04\u0E27\u0E2D\u0E40\u0E15\u0E2D\u0E23\u0E4C\u0E40\u0E27\u0E1F",
        title: "\u0E02\u0E49\u0E2D 5: \u0E2A\u0E32\u0E22\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E23\u0E31\u0E1A\u0E2A\u0E31\u0E0D\u0E0D\u0E32\u0E13 1/4 \u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19",
        problemText: `\u0E2A\u0E32\u0E22\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E41\u0E1A\u0E1A\u0E42\u0E21\u0E42\u0E19\u0E42\u0E1E\u0E25 (Quarter-wave Monopole) \u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E1A \\(\\frac{1}{4}\\) \u0E02\u0E2D\u0E07\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19 (\\(L = \\frac{\\lambda}{4}\\)) \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E23\u0E31\u0E1A\u0E04\u0E25\u0E37\u0E48\u0E19\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48 \\(f = ${freq5MHz.toFixed(1)} \\text{ MHz}\\) \u0E43\u0E19\u0E2A\u0E38\u0E0D\u0E0D\u0E32\u0E01\u0E32\u0E28 (\\(c = 3.00 \\times 10^8 \\text{ m/s}\\)) \u0E08\u0E07\u0E2B\u0E32\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E02\u0E2D\u0E07\u0E2A\u0E32\u0E22\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E19\u0E35\u0E49\u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E40\u0E21\u0E15\u0E23 (m)`,
        unit: "m",
        correctAnswer: Math.round(antennaLen * 100) / 100,
        solutionSteps: [
          `\\(\\lambda = \\frac{c}{f} = \\frac{3.00 \\times 10^8}{${formatLatexScientific(freq5Hz)}} = ${lambda5.toFixed(2)} \\text{ m}\\)`,
          `\\(L = \\frac{\\lambda}{4} = \\frac{${lambda5.toFixed(2)}}{4} = ${antennaLen.toFixed(2)} \\text{ m}\\)`
        ]
      };
      return [q1, q2, q3, q4, q5];
    }
  };

  // src/adapters/ui/exam-ui.js
  var ExamUIAdapter = class {
    constructor() {
      this.examManager = new ExamManager(1);
      this.tabSwitchCount = 0;
      this.refreshCount = 0;
      this.init();
    }
    init() {
      if (typeof document === "undefined") return;
      if (typeof window !== "undefined") {
        window.startExamProcess = () => this.startExamProcess();
        window.confirmSubmitExam = () => this.confirmSubmitExam();
        window.dismissCheatWarning = () => this.dismissCheatWarning();
        window.toggleExamSolutionBox = () => this.toggleExamSolutionBox();
        window.showLatestResultModal = () => this.showLatestResultModal();
        window.closeLatestResultModal = () => this.closeLatestResultModal();
        window.recordExamAnswer = (qIdx, val) => this.recordAnswer(qIdx, val);
      }
      this.examManager.onTickCallback = (secondsLeft, timerStr) => {
        this.updateTimerDisplay(secondsLeft, timerStr);
      };
      this.examManager.onStateChangeCallback = (state, result) => {
        if (state === EXAM_STATES.SUBMITTED || state === EXAM_STATES.REVIEW) {
          TabNavigatorAdapter.setExamInProgress(false);
          this.renderResults(result || this.examManager.examResult);
        }
      };
      this.setupAntiCheatDetection();
      const savedSession = LocalStorageAdapter.loadExamSession();
      const savedResult = LocalStorageAdapter.loadExamResult();
      if (savedResult) {
        this.updateHomeLastScore(savedResult.totalScore);
      }
      if (savedSession) {
        const resumed = this.examManager.resumeExamSession(savedSession);
        if (resumed) {
          this.refreshCount++;
          TabNavigatorAdapter.setExamInProgress(true);
          this.renderActiveExamView();
        } else {
          LocalStorageAdapter.clearExamSession();
        }
      }
    }
    /**
     * Setup Anti-Cheat tab-switch and blur detection
     */
    setupAntiCheatDetection() {
      if (typeof window === "undefined") return;
      const handleVisibilityChange = () => {
        if (this.examManager.state === EXAM_STATES.IN_PROGRESS) {
          if (document.hidden) {
            this.tabSwitchCount++;
            this.triggerCheatWarning("\u0E15\u0E23\u0E27\u0E08\u0E1E\u0E1A\u0E01\u0E32\u0E23\u0E2A\u0E25\u0E31\u0E1A\u0E2B\u0E19\u0E49\u0E32\u0E15\u0E48\u0E32\u0E07\u0E2B\u0E23\u0E37\u0E2D\u0E2D\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E41\u0E17\u0E47\u0E1A\u0E2A\u0E2D\u0E1A!");
          } else {
            this.examManager.syncTimeRemaining();
          }
        }
      };
      const handleBlur = () => {
        if (this.examManager.state === EXAM_STATES.IN_PROGRESS) {
          this.tabSwitchCount++;
          this.triggerCheatWarning("\u0E15\u0E23\u0E27\u0E08\u0E1E\u0E1A\u0E01\u0E32\u0E23\u0E04\u0E25\u0E34\u0E01\u0E2D\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E2B\u0E19\u0E49\u0E32\u0E15\u0E48\u0E32\u0E07\u0E02\u0E49\u0E2D\u0E2A\u0E2D\u0E1A!");
        }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("blur", handleBlur);
      window.addEventListener("beforeunload", () => {
        if (this.examManager.state === EXAM_STATES.IN_PROGRESS) {
          this.examManager._saveSessionState(0);
        }
      });
    }
    /**
     * Trigger high-contrast floating anti-cheat warning banner
     */
    triggerCheatWarning(msg) {
      const banner = document.getElementById("cheat-warning-banner");
      const textEl = document.getElementById("cheat-warning-text");
      if (!banner || !textEl) return;
      textEl.textContent = `${msg} (\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07\u0E17\u0E35\u0E48 ${this.tabSwitchCount})`;
      banner.classList.remove("hidden");
      banner.style.opacity = "1";
      banner.style.transform = "translateX(0)";
      banner.classList.add("cheat-shake");
      setTimeout(() => {
        banner.classList.remove("cheat-shake");
      }, 450);
    }
    /**
     * Dismiss warning banner
     */
    dismissCheatWarning() {
      const banner = document.getElementById("cheat-warning-banner");
      if (banner) {
        banner.style.opacity = "0";
        banner.style.transform = "translateX(110%)";
        setTimeout(() => banner.classList.add("hidden"), 350);
      }
    }
    /**
     * Start exam process from start screen
     */
    startExamProcess() {
      const nameInput = document.getElementById("exam-student-name");
      const classSelect = document.getElementById("exam-student-class");
      const rollInput = document.getElementById("exam-student-no");
      const fullName = nameInput ? nameInput.value.trim() : "";
      const className = classSelect ? `\u0E21.${classSelect.value}` : "\u0E21.6/1";
      const rollNumber = rollInput ? parseInt(rollInput.value, 10) : 1;
      if (!fullName) {
        alert("\u0E01\u0E23\u0E38\u0E13\u0E32\u0E23\u0E30\u0E1A\u0E38\u0E0A\u0E37\u0E48\u0E2D-\u0E19\u0E32\u0E21\u0E2A\u0E01\u0E38\u0E25\u0E01\u0E48\u0E2D\u0E19\u0E40\u0E23\u0E34\u0E48\u0E21\u0E01\u0E32\u0E23\u0E2A\u0E2D\u0E1A");
        if (nameInput) nameInput.focus();
        return;
      }
      if (isNaN(rollNumber) || rollNumber < 1 || rollNumber > 40) {
        alert("\u0E01\u0E23\u0E38\u0E13\u0E32\u0E23\u0E30\u0E1A\u0E38\u0E40\u0E25\u0E02\u0E17\u0E35\u0E48\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07 1 \u0E16\u0E36\u0E07 40");
        if (rollInput) rollInput.focus();
        return;
      }
      this.tabSwitchCount = 0;
      this.refreshCount = 0;
      this.examManager.setIdentity(fullName, className, rollNumber);
      this.examManager.startExam();
      TabNavigatorAdapter.setExamInProgress(true);
      this.renderActiveExamView();
    }
    /**
     * Render all 5 questions into #sec-exam-live
     */
    renderActiveExamView() {
      const container = document.getElementById("exam-questions-container");
      const userInfoEl = document.getElementById("lbl-exam-user-info");
      if (!container) return;
      if (userInfoEl) {
        userInfoEl.textContent = `\u0E1C\u0E39\u0E49\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E2D\u0E1A: ${this.examManager.fullName} (${this.examManager.className}) \u0E40\u0E25\u0E02\u0E17\u0E35\u0E48 ${this.examManager.rollNumber}`;
      }
      container.innerHTML = this.examManager.questions.map((q, idx) => {
        const currentAns = this.examManager.userAnswers[idx] ?? "";
        return `
        <div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <span class="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-700">
              \u0E02\u0E49\u0E2D\u0E17\u0E35\u0E48 ${idx + 1} \u2022 ${q.topic}
            </span>
            <span class="text-xs font-bold font-mono text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              2.0 \u0E04\u0E30\u0E41\u0E19\u0E19
            </span>
          </div>

          <h4 class="text-base font-bold text-slate-800">${q.title}</h4>

          <div class="exam-problem-content text-slate-700 bg-slate-50 p-4 md:p-5 rounded-xl border border-slate-200 text-sm md:text-base leading-relaxed math-font">
            ${q.problemText}
          </div>

          <!-- Answer Zone -->
          <div class="pt-2">
            ${q.type === "choice" ? `
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                ${q.choices.map(
          (choice, cIdx) => `
                  <label class="exam-choice-label flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${String(currentAns) === String(cIdx) ? "bg-blue-50 border-blue-500 text-blue-900 font-semibold" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"}">
                    <input type="radio" name="exam-q-${idx}" value="${cIdx}" ${String(currentAns) === String(cIdx) ? "checked" : ""} onchange="recordExamAnswer(${idx}, ${cIdx})" class="w-4 h-4 text-blue-600" />
                    <span class="text-xs md:text-sm flex-1">${choice}</span>
                  </label>
                `
        ).join("")}
              </div>
            ` : `
              <div class="flex items-center gap-3 max-w-sm">
                <label class="text-xs font-bold text-slate-600">\u0E04\u0E33\u0E15\u0E2D\u0E1A:</label>
                <input type="number" step="any" value="${currentAns}" placeholder="\u0E01\u0E23\u0E2D\u0E01\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E04\u0E33\u0E15\u0E2D\u0E1A"
                  oninput="recordExamAnswer(${idx}, this.value)"
                  class="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-base" />
                <span class="text-xs font-bold font-mono text-slate-500 bg-slate-100 px-3 py-2.5 rounded-xl border border-slate-200">
                  ${q.unit || ""}
                </span>
              </div>
            `}
          </div>
        </div>
      `;
      }).join("");
      this.renderMathExpressions();
    }
    /**
     * Record answer for question index
     */
    recordAnswer(qIdx, val) {
      this.examManager.recordAnswer(qIdx, val, qIdx);
      if (this.examManager.questions[qIdx]?.type === "choice") {
        const radios = document.querySelectorAll(`input[name="exam-q-${qIdx}"]`);
        radios.forEach((r) => {
          const label = r.closest("label");
          if (label) {
            if (r.checked) {
              label.className = "exam-choice-label flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all bg-blue-50 border-blue-500 text-blue-900 font-semibold";
            } else {
              label.className = "exam-choice-label flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all bg-white border-slate-200 text-slate-700 hover:bg-slate-50";
            }
          }
        });
      }
    }
    /**
     * Confirm and submit exam
     */
    confirmSubmitExam() {
      const unanswered = this.examManager.questions.filter((_, idx) => {
        const a = this.examManager.userAnswers[idx];
        return a === void 0 || a === "";
      }).length;
      let confirmMsg = "\u0E04\u0E38\u0E13\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E41\u0E25\u0E30\u0E2A\u0E48\u0E07\u0E02\u0E49\u0E2D\u0E2A\u0E2D\u0E1A\u0E43\u0E0A\u0E48\u0E2B\u0E23\u0E37\u0E2D\u0E44\u0E21\u0E48?";
      if (unanswered > 0) {
        confirmMsg = `\u0E04\u0E38\u0E13\u0E22\u0E31\u0E07\u0E21\u0E35\u0E02\u0E49\u0E2D\u0E2A\u0E2D\u0E1A\u0E17\u0E35\u0E48\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E15\u0E2D\u0E1A\u0E2D\u0E35\u0E01 ${unanswered} \u0E02\u0E49\u0E2D!
\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E41\u0E25\u0E30\u0E2A\u0E48\u0E07\u0E02\u0E49\u0E2D\u0E2A\u0E2D\u0E1A\u0E15\u0E2D\u0E19\u0E19\u0E35\u0E49\u0E43\u0E0A\u0E48\u0E2B\u0E23\u0E37\u0E2D\u0E44\u0E21\u0E48?`;
      }
      if (confirm(confirmMsg)) {
        this.examManager.submitExam(false);
      }
    }
    /**
     * Update timer display string
     */
    updateTimerDisplay(secondsLeft, timerStr) {
      const timerDisplay = document.getElementById("exam-timer-display");
      if (timerDisplay) {
        timerDisplay.textContent = timerStr;
        if (secondsLeft < 180) {
          timerDisplay.className = "font-mono text-lg font-bold text-red-400 tracking-wider animate-pulse";
        } else {
          timerDisplay.className = "font-mono text-lg font-bold text-white tracking-wider";
        }
      }
    }
    /**
     * Render results into #sec-exam-result
     */
    renderResults(res) {
      if (!res) return;
      TabNavigatorAdapter.showSection("exam-result");
      this.updateHomeLastScore(res.totalScore);
      const circle = document.getElementById("res-circle-progress");
      const totalScoreEl = document.getElementById("lbl-res-total-score");
      if (circle) {
        const perimeter = 439.8;
        const offset = perimeter - res.percentage / 100 * perimeter;
        setTimeout(() => {
          circle.style.strokeDashoffset = String(offset);
        }, 100);
      }
      if (totalScoreEl) totalScoreEl.textContent = String(res.totalScore);
      const nameEl = document.getElementById("lbl-res-student-name");
      const metaEl = document.getElementById("lbl-res-student-meta");
      const timeEl = document.getElementById("lbl-res-time-elapsed");
      const dateEl = document.getElementById("lbl-res-finished-at");
      if (nameEl) nameEl.textContent = res.fullName || "\u0E1C\u0E39\u0E49\u0E2A\u0E2D\u0E1A";
      if (metaEl) metaEl.textContent = `${res.className || "\u0E21.6/1"} \u2022 \u0E40\u0E25\u0E02\u0E17\u0E35\u0E48 #${res.rollNumber}`;
      if (timeEl) timeEl.textContent = res.formattedTimeTaken || "15 \u0E19\u0E32\u0E17\u0E35";
      if (dateEl) dateEl.textContent = res.formattedSubmittedAt || (/* @__PURE__ */ new Date()).toLocaleString("th-TH");
      const cheatCard = document.getElementById("exam-cheat-summary-card");
      const tabSwitchesEl = document.getElementById("lbl-res-tab-switches");
      const refreshesEl = document.getElementById("lbl-res-refreshes");
      if (this.tabSwitchCount > 0 || this.refreshCount > 0) {
        if (cheatCard) cheatCard.classList.remove("hidden");
        if (tabSwitchesEl) tabSwitchesEl.textContent = `${this.tabSwitchCount} \u0E04\u0E23\u0E31\u0E49\u0E07`;
        if (refreshesEl) refreshesEl.textContent = `${this.refreshCount} \u0E04\u0E23\u0E31\u0E49\u0E07`;
      } else {
        if (cheatCard) cheatCard.classList.add("hidden");
      }
      const feedbackBadge = document.getElementById("lbl-res-badge-feedback");
      if (feedbackBadge) {
        if (res.totalScore >= 8) {
          feedbackBadge.className = "text-center p-4 rounded-xl mb-8 border border-emerald-200 bg-emerald-50 text-emerald-800 text-sm font-semibold";
          feedbackBadge.textContent = "\u{1F31F} \u0E1C\u0E25\u0E01\u0E32\u0E23\u0E2A\u0E2D\u0E1A\u0E23\u0E30\u0E14\u0E31\u0E1A\u0E22\u0E2D\u0E14\u0E40\u0E22\u0E35\u0E48\u0E22\u0E21! \u0E04\u0E38\u0E13\u0E40\u0E02\u0E49\u0E32\u0E43\u0E08\u0E2B\u0E25\u0E31\u0E01\u0E01\u0E32\u0E23\u0E04\u0E25\u0E37\u0E48\u0E19\u0E41\u0E21\u0E48\u0E40\u0E2B\u0E25\u0E47\u0E01\u0E44\u0E1F\u0E1F\u0E49\u0E32\u0E44\u0E14\u0E49\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E41\u0E21\u0E48\u0E19\u0E22\u0E33\u0E21\u0E32\u0E01";
        } else if (res.totalScore >= 6) {
          feedbackBadge.className = "text-center p-4 rounded-xl mb-8 border border-blue-200 bg-blue-50 text-blue-800 text-sm font-semibold";
          feedbackBadge.textContent = "\u{1F389} \u0E1C\u0E48\u0E32\u0E19\u0E40\u0E01\u0E13\u0E11\u0E4C\u0E01\u0E32\u0E23\u0E1B\u0E23\u0E30\u0E40\u0E21\u0E34\u0E19! \u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E17\u0E1A\u0E17\u0E27\u0E19\u0E27\u0E34\u0E18\u0E35\u0E17\u0E33\u0E43\u0E19\u0E02\u0E49\u0E2D\u0E17\u0E35\u0E48\u0E1C\u0E34\u0E14\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E41\u0E21\u0E48\u0E19\u0E22\u0E33\u0E22\u0E34\u0E48\u0E07\u0E02\u0E36\u0E49\u0E19";
        } else {
          feedbackBadge.className = "text-center p-4 rounded-xl mb-8 border border-amber-200 bg-amber-50 text-amber-800 text-sm font-semibold";
          feedbackBadge.textContent = "\u26A0\uFE0F \u0E04\u0E30\u0E41\u0E19\u0E19\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E1C\u0E48\u0E32\u0E19\u0E40\u0E01\u0E13\u0E11\u0E4C 60% \u0E41\u0E19\u0E30\u0E19\u0E33\u0E43\u0E2B\u0E49\u0E01\u0E25\u0E31\u0E1A\u0E44\u0E1B\u0E17\u0E1A\u0E17\u0E27\u0E19\u0E1A\u0E17\u0E40\u0E23\u0E35\u0E22\u0E19\u0E41\u0E25\u0E30\u0E1D\u0E36\u0E01\u0E17\u0E33\u0E42\u0E08\u0E17\u0E22\u0E4C\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07";
        }
      }
      const tbody = document.getElementById("exam-result-tbody");
      if (tbody) {
        tbody.innerHTML = res.gradedQuestions.map(
          (q, idx) => `
        <tr class="hover:bg-slate-50 transition">
          <td class="px-5 py-4 font-bold text-slate-800">\u0E02\u0E49\u0E2D\u0E17\u0E35\u0E48 ${idx + 1}</td>
          <td class="px-5 py-4 text-slate-600">${q.topic} - ${q.title}</td>
          <td class="px-5 py-4 text-center font-mono text-slate-500">2.0</td>
          <td class="px-5 py-4 text-center">
            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${q.isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}">
              ${q.scoreObtained.toFixed(1)}
            </span>
          </td>
        </tr>
      `
        ).join("");
      }
      const solutionsContainer = document.getElementById("exam-solutions-container");
      if (solutionsContainer) {
        solutionsContainer.innerHTML = res.gradedQuestions.map(
          (q, idx) => `
        <div class="bg-white p-5 rounded-2xl border ${q.isCorrect ? "border-emerald-200" : "border-red-200"} space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold px-2.5 py-1 rounded-lg ${q.isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}">
              \u0E02\u0E49\u0E2D\u0E17\u0E35\u0E48 ${idx + 1} \u2022 ${q.isCorrect ? "\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07 (+2.0)" : "\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07 (0.0)"}
            </span>
            <span class="text-xs text-slate-500 font-mono">${q.topic}</span>
          </div>

          <p class="text-sm font-medium text-slate-800 math-font">${q.problemText}</p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span class="text-slate-500 block mb-0.5">\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13:</span>
              <span class="font-bold text-sm ${q.isCorrect ? "text-emerald-600" : "text-red-600"}">
                ${q.userAnswer ?? "-"} ${q.unit || ""}
              </span>
            </div>
            <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span class="text-slate-500 block mb-0.5">\u0E40\u0E09\u0E25\u0E22\u0E17\u0E35\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07:</span>
              <span class="font-bold text-sm text-emerald-600">
                ${q.type === "choice" ? q.choices[q.correctChoiceIndex] : `${q.correctAnswer} ${q.unit || ""}`}
              </span>
            </div>
          </div>

          <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div class="font-bold text-blue-600 flex items-center gap-1.5">
              <i class="fa-solid fa-lightbulb"></i> \u0E27\u0E34\u0E18\u0E35\u0E17\u0E33\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14:
            </div>
            <ol class="list-decimal pl-4 space-y-1 text-slate-700 math-font">
              ${q.solutionSteps.map((s) => `<li>${s}</li>`).join("")}
            </ol>
          </div>
        </div>
      `
        ).join("");
      }
      this.renderMathExpressions();
    }
    /**
     * Toggle solution box
     */
    toggleExamSolutionBox() {
      const box = document.getElementById("exam-solution-box");
      const icon = document.getElementById("icon-toggle-sol");
      const text = document.getElementById("lbl-toggle-solution-text");
      if (!box) return;
      if (box.classList.contains("hidden")) {
        box.classList.remove("hidden");
        if (icon) icon.className = "fa-solid fa-chevron-up";
        if (text) text.textContent = "\u0E0B\u0E48\u0E2D\u0E19\u0E04\u0E33\u0E40\u0E09\u0E25\u0E22\u0E41\u0E25\u0E30\u0E27\u0E34\u0E18\u0E35\u0E17\u0E33";
      } else {
        box.classList.add("hidden");
        if (icon) icon.className = "fa-solid fa-chevron-down";
        if (text) text.textContent = "\u0E41\u0E2A\u0E14\u0E07\u0E04\u0E33\u0E40\u0E09\u0E25\u0E22\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E41\u0E25\u0E30\u0E41\u0E2A\u0E14\u0E07\u0E27\u0E34\u0E18\u0E35\u0E17\u0E33";
      }
    }
    /**
     * Update home screen score badge
     */
    updateHomeLastScore(score) {
      const el = document.getElementById("lbl-last-score");
      if (el) {
        el.textContent = `${score} / 10 \u0E04\u0E30\u0E41\u0E19\u0E19`;
      }
    }
    /**
     * Open Latest Result Modal from Home page
     */
    showLatestResultModal() {
      const modal = document.getElementById("latest-result-modal");
      const content = document.getElementById("modal-latest-result-content");
      const result = LocalStorageAdapter.loadExamResult();
      if (!result) {
        alert("\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E01\u0E32\u0E23\u0E2A\u0E2D\u0E1A \u0E01\u0E23\u0E38\u0E13\u0E32\u0E17\u0E33\u0E41\u0E1A\u0E1A\u0E17\u0E14\u0E2A\u0E2D\u0E1A\u0E40\u0E01\u0E47\u0E1A\u0E04\u0E30\u0E41\u0E19\u0E19\u0E01\u0E48\u0E2D\u0E19");
        return;
      }
      if (content) {
        content.innerHTML = `
        <div class="text-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div class="text-4xl font-extrabold text-blue-600 font-mono">${result.totalScore} / 10</div>
          <div class="text-xs text-slate-500 mt-1">\u0E04\u0E30\u0E41\u0E19\u0E19\u0E23\u0E27\u0E21 (${result.percentage.toFixed(0)}%)</div>
        </div>
        <div class="space-y-2 text-xs">
          <div class="flex justify-between py-1 border-b border-slate-100">
            <span class="text-slate-500">\u0E0A\u0E37\u0E48\u0E2D\u0E1C\u0E39\u0E49\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E2D\u0E1A:</span>
            <span class="font-bold text-slate-800">${result.fullName} (${result.className}) \u0E40\u0E25\u0E02\u0E17\u0E35\u0E48 ${result.rollNumber}</span>
          </div>
          <div class="flex justify-between py-1 border-b border-slate-100">
            <span class="text-slate-500">\u0E40\u0E27\u0E25\u0E32\u0E17\u0E35\u0E48\u0E43\u0E0A\u0E49:</span>
            <span class="font-bold text-slate-800">${result.formattedTimeTaken}</span>
          </div>
          <div class="flex justify-between py-1 border-b border-slate-100">
            <span class="text-slate-500">\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E2A\u0E48\u0E07\u0E02\u0E49\u0E2D\u0E2A\u0E2D\u0E1A:</span>
            <span class="font-bold text-slate-800">${result.formattedSubmittedAt}</span>
          </div>
        </div>
      `;
      }
      if (modal) modal.classList.remove("hidden");
    }
    /**
     * Close Latest Result Modal
     */
    closeLatestResultModal() {
      const modal = document.getElementById("latest-result-modal");
      if (modal) modal.classList.add("hidden");
    }
    /**
     * Render KaTeX Math Expressions safely via KaTeXAdapter
     */
    renderMathExpressions() {
      const liveContainer = document.getElementById("sec-exam-live");
      if (liveContainer && !liveContainer.classList.contains("hidden")) {
        KaTeXAdapter.renderAllMath(liveContainer);
      }
      const resultContainer = document.getElementById("sec-exam-result");
      if (resultContainer && !resultContainer.classList.contains("hidden")) {
        KaTeXAdapter.renderAllMath(resultContainer);
      }
    }
  };

  // src/main.js
  setupErrorBoundary();
  document.addEventListener("DOMContentLoaded", () => {
    console.log(`[Physics Portal] Initializing ${APP_CONFIG.appName} v${APP_CONFIG.version}`);
    console.log(`[Physics Constants] c = ${SPEED_OF_LIGHT.toExponential(2)} m/s, h = ${PLANCK_CONSTANT.toExponential(3)} J\xB7s`);
    verifyKaTeXLoaded();
    try {
      const canvasEMWave = document.getElementById("canvas-em-wave");
      let emWaveSim = null;
      if (canvasEMWave) {
        emWaveSim = new EMWaveSimulator(canvasEMWave);
        ControlPanelAdapter.bindEMWaveControls(emWaveSim);
      }
      const canvasSpectrum = document.getElementById("canvas-spectrum");
      let spectrumSim = null;
      if (canvasSpectrum) {
        spectrumSim = new SpectrumSimulator(canvasSpectrum);
        ControlPanelAdapter.bindSpectrumControls(spectrumSim);
      }
      const canvasPolarization = document.getElementById("canvas-polarization");
      let polarizationSim = null;
      if (canvasPolarization) {
        polarizationSim = new PolarizationSimulator(canvasPolarization);
        ControlPanelAdapter.bindPolarizationControls(polarizationSim);
      }
      const quizUI = new QuizUIAdapter();
      const examUI = new ExamUIAdapter();
      TabNavigatorAdapter.init({
        emWaveSim,
        spectrumSim,
        polarizationSim
      });
      renderAllMathFormulas();
      console.log("[Physics Portal] All modules and simulators initialized successfully with U-17 UI architecture.");
    } catch (err) {
      console.error("[Physics Portal Error] Failed to initialize portal modules:", err);
    }
  });
  function renderAllMathFormulas() {
    let attempts = 0;
    const maxAttempts = 20;
    const tryRender = () => {
      attempts++;
      if (typeof window.katex !== "undefined") {
        KaTeXAdapter.renderAllMath(document.body);
      } else if (attempts < maxAttempts) {
        setTimeout(tryRender, 80);
      }
    };
    tryRender();
    if (document.readyState !== "complete") {
      window.addEventListener("load", () => {
        KaTeXAdapter.renderAllMath(document.body);
      });
    }
  }
  function verifyKaTeXLoaded() {
    if (typeof window.katex !== "undefined") {
      console.log("[KaTeX Adapter] Local KaTeX engine loaded successfully for offline formula rendering.");
    } else {
      console.warn("[KaTeX Adapter] KaTeX not found in global window context. Retrying...");
    }
  }
  function setupErrorBoundary() {
    window.addEventListener("error", (evt) => {
      console.error("[Global Error Boundary]", evt.message, evt.filename, evt.lineno);
    });
    window.addEventListener("unhandledrejection", (evt) => {
      console.error("[Unhandled Rejection Boundary]", evt.reason);
    });
  }
})();
