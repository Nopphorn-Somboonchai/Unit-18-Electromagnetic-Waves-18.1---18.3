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
     * Scan and render all inline KaTeX math expressions \\(...\\) and $...$ in container
     * @param {HTMLElement} [container=document.body]
     */
    static renderAllMath(container = document.body) {
      if (typeof window.katex === "undefined" || !container) return;
      const targets = container.querySelectorAll(".glass-panel div, .glass-panel p, .glass-panel label, .glass-panel li, .glass-panel h3, .glass-panel h4");
      targets.forEach((el) => {
        if (el.querySelector(".katex")) return;
        let html = el.innerHTML;
        let modified = false;
        if (html.includes("\\(")) {
          html = html.replace(/\\\((.*?)\\\)/g, (match, math) => {
            try {
              modified = true;
              return window.katex.renderToString(math, { displayMode: false, throwOnError: false });
            } catch (e) {
              return match;
            }
          });
        }
        if (html.includes("$")) {
          html = html.replace(/\$(.*?)\$/g, (match, math) => {
            try {
              modified = true;
              return window.katex.renderToString(math, { displayMode: false, throwOnError: false });
            } catch (e) {
              return match;
            }
          });
        }
        if (modified) {
          el.innerHTML = html;
        }
      });
    }
    /**
     * Pre-defined physics LaTeX formula templates for Unit 18
     */
    static TEMPLATES = Object.freeze({
      SPEED_OF_LIGHT: "c = f \\lambda",
      WAVELENGTH_SOLVER: "\\lambda = \\frac{c}{f}",
      PHOTON_ENERGY: "E = hf = \\frac{hc}{\\lambda}",
      MALUS_LAW: "I = I_0 \\cos^2\\theta",
      POLAROID_TWO: "I_2 = I_1 \\cos^2(\\theta_2 - \\theta_1)",
      UNPOLARIZED_P1: "I_1 = \\frac{I_0}{2}",
      VECTOR_FIELD: "\\vec{E} \\perp \\vec{B} \\perp \\vec{v}",
      RIGHT_HAND_RULE: "\\vec{E} \\times \\vec{B} = \\vec{v}"
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
          valIntensity.textContent = `${intensity2.toFixed(1)}% (${frac} I\u2080)`;
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
    /**
     * Set exam protection lock state
     * @param {boolean} inProgress
     */
    static setExamInProgress(inProgress) {
      this.isExamInProgress = !!inProgress;
      this.updateTabLockUI();
    }
    /**
     * Update visual lock styling on tab buttons
     */
    static updateTabLockUI() {
      if (typeof document === "undefined") return;
      const tabButtons = document.querySelectorAll(".nav-tab-btn");
      tabButtons.forEach((btn) => {
        const tabId = btn.getAttribute("data-tab");
        if (tabId !== "tab-exam") {
          if (this.isExamInProgress) {
            btn.classList.add("opacity-40", "cursor-not-allowed");
            btn.setAttribute("title", "\u0E2D\u0E22\u0E39\u0E48\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07\u0E01\u0E32\u0E23\u0E2A\u0E2D\u0E1A \u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E40\u0E02\u0E49\u0E32\u0E16\u0E36\u0E07\u0E41\u0E17\u0E47\u0E1A\u0E19\u0E35\u0E49\u0E44\u0E14\u0E49");
          } else {
            btn.classList.remove("opacity-40", "cursor-not-allowed");
            btn.removeAttribute("title");
          }
        }
      });
    }
    /**
     * Initialize Tab Navigator
     * @param {Object} simulators - Dictionary of simulators { emWaveSim, spectrumSim, polarizationSim }
     */
    static init(simulators = {}) {
      const tabButtons = document.querySelectorAll(".nav-tab-btn");
      const tabContents = document.querySelectorAll(".tab-content");
      tabButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const targetTabId = btn.getAttribute("data-tab");
          if (this.isExamInProgress && targetTabId !== "tab-exam") {
            e.preventDefault();
            e.stopPropagation();
            alert("\u26A0\uFE0F \u0E2D\u0E22\u0E39\u0E48\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07\u0E01\u0E32\u0E23\u0E17\u0E33\u0E02\u0E49\u0E2D\u0E2A\u0E2D\u0E1A\u0E40\u0E01\u0E47\u0E1A\u0E04\u0E30\u0E41\u0E19\u0E19 (15 \u0E19\u0E32\u0E17\u0E35)!\n\u0E23\u0E30\u0E1A\u0E1A\u0E44\u0E21\u0E48\u0E2D\u0E19\u0E38\u0E0D\u0E32\u0E15\u0E43\u0E2B\u0E49\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E44\u0E1B\u0E14\u0E39\u0E40\u0E19\u0E37\u0E49\u0E2D\u0E2B\u0E32\u0E2B\u0E23\u0E37\u0E2D\u0E1D\u0E36\u0E01\u0E17\u0E33\u0E42\u0E08\u0E17\u0E22\u0E4C\u0E43\u0E19\u0E41\u0E17\u0E47\u0E1A\u0E2D\u0E37\u0E48\u0E19\u0E08\u0E19\u0E01\u0E27\u0E48\u0E32\u0E08\u0E30\u0E2A\u0E48\u0E07\u0E02\u0E49\u0E2D\u0E2A\u0E2D\u0E1A");
            return;
          }
          tabButtons.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          tabContents.forEach((content) => {
            if (content.id === targetTabId) {
              content.classList.remove("hidden");
            } else {
              content.classList.add("hidden");
            }
          });
          if (targetTabId === "tab-review") {
            if (simulators.emWaveSim) simulators.emWaveSim.start();
            if (simulators.spectrumSim) simulators.spectrumSim.render();
            if (simulators.polarizationSim) simulators.polarizationSim.render();
          } else {
            if (simulators.emWaveSim) simulators.emWaveSim.pause();
          }
        });
      });
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
  function formatScientific(num, decimals = 2) {
    const val = Number(num);
    if (isNaN(val) || val === 0) return "0";
    const absVal = Math.abs(val);
    if (absVal >= 0.01 && absVal < 1e4) {
      return val.toFixed(decimals);
    }
    const exp = Math.floor(Math.log10(absVal));
    const mantissa = val / Math.pow(10, exp);
    return `${mantissa.toFixed(decimals)} \xD7 10${toSuperscriptExponent(exp)}`;
  }
  function toSuperscriptExponent(exp) {
    const map = {
      "-": "\u207B",
      "0": "\u2070",
      "1": "\xB9",
      "2": "\xB2",
      "3": "\xB3",
      "4": "\u2074",
      "5": "\u2075",
      "6": "\u2076",
      "7": "\u2077",
      "8": "\u2078",
      "9": "\u2079"
    };
    return String(exp).split("").map((char) => map[char] || char).join("");
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
            `\u0E41\u0E17\u0E19\u0E04\u0E48\u0E32\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48 \\(f = ${freqMHz.toFixed(1)} \\text{ MHz} = ${formatScientific(freqHz)} \\text{ Hz}\\)`,
            `\u0E41\u0E17\u0E19\u0E04\u0E48\u0E32\u0E2D\u0E31\u0E15\u0E23\u0E32\u0E40\u0E23\u0E47\u0E27\u0E41\u0E2A\u0E07 \\(c = 3.00 \\times 10^8 \\text{ m/s}\\)`,
            `\\(\\lambda = \\frac{3.00 \\times 10^8}{${formatScientific(freqHz)}} = ${correctWavelength.toFixed(3)} \\text{ m}\\)`,
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
          problemText: `\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E2D\u0E2D\u0E01\u0E41\u0E1A\u0E1A\u0E2A\u0E32\u0E22\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E23\u0E31\u0E1A\u0E2A\u0E31\u0E0D\u0E0D\u0E32\u0E13\u0E27\u0E34\u0E17\u0E22\u0E38\u0E41\u0E1A\u0E1A\u0E44\u0E14\u0E42\u0E1E\u0E25\u0E04\u0E23\u0E36\u0E48\u0E07\u0E04\u0E25\u0E37\u0E48\u0E19 (Half-wave Dipole Antenna) \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E23\u0E31\u0E1A\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48 \\(f = ${freqMHz.toFixed(1)} \\text{ MHz}\\) \u0E08\u0E07\u0E04\u0E33\u0E19\u0E27\u0E13\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E02\u0E2D\u0E07\u0E2A\u0E32\u0E22\u0E2D\u0E32\u0E01\u0E32\u0E28 (\\(L = \\lambda/2\\)) \u0E17\u0E35\u0E48\u0E40\u0E2B\u0E21\u0E32\u0E30\u0E2A\u0E21\u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E40\u0E21\u0E15\u0E23 (m)`,
          unit: "m",
          correctAnswer: Math.round(antennaLength * 100) / 100,
          tolerance: 0.03,
          solutionSteps: [
            `**\u0E2A\u0E39\u0E15\u0E23\u0E2B\u0E32\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19**: \\(\\lambda = \\frac{c}{f} = \\frac{3.00 \\times 10^8}{${formatScientific(freqHz)}} = ${lambda.toFixed(3)} \\text{ m}\\)`,
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
          `\u0E41\u0E17\u0E19\u0E04\u0E48\u0E32\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E08\u0E39\u0E25: \\(E = (6.626 \\times 10^{-34}) \\times (${freqFactor.toFixed(2)} \\times 10^{14}) = ${formatScientific(energyObj.joules)} \\text{ J}\\)`,
          `\u0E41\u0E1B\u0E25\u0E07\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E40\u0E1B\u0E47\u0E19 eV: \\(E_{\\text{eV}} = \\frac{${formatScientific(energyObj.joules)}}{1.602 \\times 10^{-19}} = ${energyObj.electronVolts.toFixed(3)} \\text{ eV}\\)`,
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
          `**\u0E02\u0E31\u0E49\u0E19\u0E15\u0E2D\u0E19\u0E17\u0E35\u0E48 1 (\u0E41\u0E1C\u0E48\u0E19 P1)**: \u0E41\u0E2A\u0E07\u0E44\u0E21\u0E48\u0E42\u0E1E\u0E25\u0E32\u0E44\u0E23\u0E2A\u0E4C\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E1C\u0E48\u0E32\u0E19\u0E41\u0E1C\u0E48\u0E19\u0E41\u0E23\u0E01 \u0E08\u0E30\u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E40\u0E02\u0E49\u0E21\u0E25\u0E14\u0E25\u0E07\u0E40\u0E2B\u0E25\u0E37\u0E2D\u0E04\u0E23\u0E36\u0E48\u0E07\u0E2B\u0E19\u0E36\u0E48\u0E07 \\(I_1 = \\frac{I_0}{2} = 50\\%\\)`,
          `**\u0E02\u0E31\u0E49\u0E19\u0E15\u0E2D\u0E19\u0E17\u0E35\u0E48 2 (\u0E41\u0E1C\u0E48\u0E19 P2 \u0E15\u0E32\u0E21\u0E01\u0E0E\u0E02\u0E2D\u0E07\u0E21\u0E32\u0E25\u0E38\u0E2A)**: \\(I_2 = I_1 \\cos^2\\theta\\)`,
          `\u0E41\u0E17\u0E19\u0E04\u0E48\u0E32\u0E21\u0E38\u0E21\u0E21\u0E32\u0E15\u0E23\u0E10\u0E32\u0E19 \\(\\theta = ${angleDeg}^\\circ\\) \\(\\rightarrow \\cos(${angleDeg}^\\circ) = ${Math.cos(angleDeg * Math.PI / 180).toFixed(4)}\\)`,
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
    /**
     * @param {HTMLElement} containerElement - Container element for quiz UI
     */
    constructor(containerElement) {
      this.container = containerElement;
      this.quizManager = new QuizManager(1);
      this.currentCategory = "mixed";
      this.currentQuestionIndex = 0;
      this.renderLayout();
    }
    /**
     * Render overall Quiz System layout into container
     */
    renderLayout() {
      if (!this.container) return;
      this.container.innerHTML = `
      <div class="space-y-6">
        
        <!-- Header & Category Filter Bar -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div class="flex items-center gap-3">
            <label for="input-quiz-roll" class="text-sm font-semibold text-slate-300">
              \u0E40\u0E25\u0E02\u0E17\u0E35\u0E48\u0E1C\u0E39\u0E49\u0E40\u0E23\u0E35\u0E22\u0E19 (R):
            </label>
            <input type="number" id="input-quiz-roll" min="1" max="40" value="${this.quizManager.rollNumber}"
              class="w-20 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono font-bold text-center focus:border-blue-500 focus:outline-none" />
          </div>

          <!-- Category Selection Pills -->
          <div class="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <button class="quiz-cat-btn px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-blue-600 text-white" data-cat="mixed">
              \u{1F500} \u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14 (\u0E1C\u0E2A\u0E21)
            </button>
            <button class="quiz-cat-btn px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-800 text-slate-300 hover:bg-slate-700" data-cat="18.1">
              18.1 \u0E04\u0E25\u0E37\u0E48\u0E19 E&B (c=f\u03BB)
            </button>
            <button class="quiz-cat-btn px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-800 text-slate-300 hover:bg-slate-700" data-cat="18.2">
              18.2 \u0E2A\u0E40\u0E1B\u0E01\u0E15\u0E23\u0E31\u0E21 (E=hf)
            </button>
            <button class="quiz-cat-btn px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-800 text-slate-300 hover:bg-slate-700" data-cat="18.3">
              18.3 \u0E42\u0E1E\u0E25\u0E32\u0E44\u0E23\u0E40\u0E0B\u0E0A\u0E31\u0E19 (\u0E21\u0E32\u0E25\u0E38\u0E2A)
            </button>
          </div>
        </div>

        <!-- Question Card Placeholder -->
        <div id="quiz-question-card" class="space-y-6"></div>

      </div>
    `;
      this._bindEvents();
      this.loadQuestion();
    }
    /**
     * Bind event listeners for Roll Number and Category buttons
     */
    _bindEvents() {
      const rollInput = this.container.querySelector("#input-quiz-roll");
      if (rollInput) {
        rollInput.addEventListener("change", (e) => {
          const newR = parseInt(e.target.value, 10);
          this.quizManager.setRollNumber(newR);
          this.loadQuestion();
          const headerStatus = document.getElementById("header-user-status");
          if (headerStatus) headerStatus.textContent = `\u0E40\u0E25\u0E02\u0E17\u0E35\u0E48 #${this.quizManager.rollNumber}`;
        });
      }
      const catButtons = this.container.querySelectorAll(".quiz-cat-btn");
      catButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          catButtons.forEach((b) => {
            b.className = "quiz-cat-btn px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-slate-800 text-slate-300 hover:bg-slate-700";
          });
          btn.className = "quiz-cat-btn px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-blue-600 text-white";
          this.currentCategory = btn.getAttribute("data-cat");
          this.currentQuestionIndex = 0;
          this.loadQuestion();
        });
      });
    }
    /**
     * Load active question card
     */
    loadQuestion() {
      const q = this.quizManager.generateQuestion(this.currentQuestionIndex, this.currentCategory);
      const cardContainer = this.container.querySelector("#quiz-question-card");
      if (!cardContainer || !q) return;
      cardContainer.innerHTML = `
      <div class="glass-panel p-6 space-y-6 border-l-4 border-l-blue-500 animate-fade-in">
        
        <!-- Question Topic & Header -->
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <span class="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">${q.topic}</span>
            <h3 class="text-xl font-bold text-white mt-2">${q.title}</h3>
          </div>
          <span class="text-xs font-mono text-slate-400">\u0E02\u0E49\u0E2D\u0E17\u0E35\u0E48 ${this.currentQuestionIndex + 1}</span>
        </div>

        <!-- Problem Description Text -->
        <div id="quiz-problem-text" class="text-slate-200 text-base leading-relaxed bg-slate-900/60 p-5 rounded-xl border border-slate-800">
          ${q.problemText}
        </div>

        <!-- Input & Answer Action Form -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-slate-900/40 p-4 rounded-xl border border-slate-800">
          <div class="flex items-center gap-2 flex-grow">
            <label for="input-quiz-answer" class="text-sm font-semibold text-slate-300 whitespace-nowrap">
              \u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13:
            </label>
            <input type="number" id="input-quiz-answer" step="any" placeholder="\u0E01\u0E23\u0E2D\u0E01\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E04\u0E33\u0E15\u0E2D\u0E1A..."
              class="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono font-bold text-lg focus:border-blue-500 focus:outline-none" />
            <span class="text-sm font-bold text-blue-400 bg-blue-950/60 px-3 py-2.5 rounded-lg border border-blue-800/60 font-mono">
              ${q.unit}
            </span>
          </div>

          <div class="flex items-center gap-3">
            <button id="btn-submit-answer" class="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20">
              <span>\u2705</span> <span>\u0E15\u0E23\u0E27\u0E08\u0E04\u0E33\u0E15\u0E2D\u0E1A</span>
            </button>
            <button id="btn-next-question" class="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition-colors flex items-center justify-center gap-2">
              <span>\u{1F504}</span> <span>\u0E42\u0E08\u0E17\u0E22\u0E4C\u0E02\u0E49\u0E2D\u0E16\u0E31\u0E14\u0E44\u0E1B</span>
            </button>
          </div>
        </div>

        <!-- Feedback & Solution Steps Card (Initially Hidden) -->
        <div id="quiz-feedback-card" class="hidden space-y-4"></div>

      </div>
    `;
      this.renderMathExpressions();
      const btnSubmit = cardContainer.querySelector("#btn-submit-answer");
      const btnNext = cardContainer.querySelector("#btn-next-question");
      const inputAnswer = cardContainer.querySelector("#input-quiz-answer");
      if (btnSubmit) {
        btnSubmit.addEventListener("click", () => this.handleSubmission());
      }
      if (inputAnswer) {
        inputAnswer.addEventListener("keyup", (e) => {
          if (e.key === "Enter") this.handleSubmission();
        });
      }
      if (btnNext) {
        btnNext.addEventListener("click", () => {
          this.currentQuestionIndex++;
          this.loadQuestion();
        });
      }
    }
    /**
     * Evaluate and display feedback + LaTeX solution steps
     */
    handleSubmission() {
      const cardContainer = this.container.querySelector("#quiz-question-card");
      const inputAnswer = cardContainer.querySelector("#input-quiz-answer");
      const feedbackCard = cardContainer.querySelector("#quiz-feedback-card");
      if (!inputAnswer || !feedbackCard) return;
      const userVal = inputAnswer.value;
      const result = this.quizManager.evaluateAnswer(userVal);
      feedbackCard.classList.remove("hidden");
      const statusBadge = result.isCorrect ? `<div class="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold text-base flex items-center gap-3">
           <span class="text-2xl">\u{1F389}</span>
           <div>
             <div>\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E41\u0E21\u0E48\u0E19\u0E22\u0E33!</div>
             <div class="text-xs text-emerald-400/80 font-normal">\u0E04\u0E27\u0E32\u0E21\u0E04\u0E25\u0E32\u0E14\u0E40\u0E04\u0E25\u0E37\u0E48\u0E2D\u0E19 ${result.relativeErrorPercent}% (\u0E1C\u0E48\u0E32\u0E19\u0E40\u0E01\u0E13\u0E11\u0E4C 3%)</div>
           </div>
         </div>` : `<div class="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 font-bold text-base flex items-center gap-3">
           <span class="text-2xl">\u274C</span>
           <div>
             <div>\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07</div>
             <div class="text-xs text-red-400/80 font-normal">${result.message} \u2014 \u0E40\u0E09\u0E25\u0E22\u0E17\u0E35\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E04\u0E37\u0E2D ${result.correctAnswer} ${this.quizManager.currentQuestion.unit}</div>
           </div>
         </div>`;
      const stepsHtml = result.solutionSteps.map((step) => `<li class="leading-relaxed">${step}</li>`).join("");
      feedbackCard.innerHTML = `
      ${statusBadge}
      <div class="bg-slate-900/90 p-5 rounded-xl border border-slate-800 space-y-3">
        <h4 class="text-sm font-bold text-amber-400 flex items-center gap-2">
          <span>\u{1F4A1}</span> \u0E40\u0E09\u0E25\u0E22\u0E27\u0E34\u0E18\u0E35\u0E17\u0E33\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14 (Step-by-Step Solution):
        </h4>
        <ol id="quiz-solution-steps-list" class="list-decimal list-inside space-y-2 text-sm text-slate-200">
          ${stepsHtml}
        </ol>
      </div>
    `;
      this.renderMathExpressions();
    }
    /**
     * Render inline KaTeX math expressions \\(...\\)
     */
    renderMathExpressions() {
      if (typeof window.katex === "undefined") return;
      const textNodes = this.container.querySelectorAll("#quiz-problem-text, #quiz-solution-steps-list li");
      textNodes.forEach((node) => {
        let html = node.innerHTML;
        html = html.replace(/\\\((.*?)\\\)/g, (match, math) => {
          try {
            return window.katex.renderToString(math, { displayMode: false, throwOnError: false });
          } catch (e) {
            return match;
          }
        });
        node.innerHTML = html;
      });
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
      this.userAnswers = {};
      this.examResult = null;
      this.attemptSeed = customSeed !== null ? customSeed : (Date.now() ^ Math.floor(Math.random() * 1e5)) >>> 0;
      this.questions = this._generateExamQuestions();
      this._startTimer();
      if (this.onStateChangeCallback) {
        this.onStateChangeCallback(this.state);
      }
      return this.questions;
    }
    /**
     * Countdown timer tick
     */
    _startTimer() {
      if (this.timerInterval) clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => {
        this.timeRemaining--;
        if (this.onTickCallback) {
          this.onTickCallback(this.timeRemaining, this.formatTimerString());
        }
        if (this.timeRemaining <= 0) {
          this.submitExam(true);
        }
      }, 1e3);
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
     */
    recordAnswer(questionIndex, answer) {
      if (this.state !== EXAM_STATES.IN_PROGRESS) return;
      this.userAnswers[questionIndex] = answer;
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
            "\u0E40\u0E1B\u0E47\u0E19\u0E04\u0E25\u0E37\u0E48\u0E19\u0E15\u0E32\u0E21\u0E02\u0E27\u0E32\u0E07\u0E17\u0E35\u0E48\u0E2A\u0E19\u0E32\u0E21\u0E44\u0E1F\u0E1F\u0E49\u0E32\u0E41\u0E25\u0E30\u0E2A\u0E19\u0E32\u0E21\u0E41\u0E21\u0E48\u0E40\u0E2B\u0E25\u0E47\u0E01\u0E15\u0E31\u0E49\u0E07\u0E09\u0E32\u0E01\u0E01\u0E31\u0E19\u0E41\u0E25\u0E30\u0E15\u0E31\u0E49\u0E07\u0E09\u0E32\u0E01\u0E01\u0E31\u0E1A\u0E17\u0E34\u0E28\u0E01\u0E32\u0E23\u0E41\u0E1C\u0E48",
            "\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E40\u0E04\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E17\u0E35\u0E48\u0E1C\u0E48\u0E32\u0E19\u0E2A\u0E38\u0E0D\u0E0D\u0E32\u0E01\u0E32\u0E28\u0E44\u0E14\u0E49\u0E14\u0E49\u0E27\u0E22\u0E2D\u0E31\u0E15\u0E23\u0E32\u0E40\u0E23\u0E47\u0E27\u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E1A\u0E2D\u0E31\u0E15\u0E23\u0E32\u0E40\u0E23\u0E47\u0E27\u0E41\u0E2A\u0E07 c",
            "\u0E08\u0E33\u0E40\u0E1B\u0E47\u0E19\u0E15\u0E49\u0E2D\u0E07\u0E2D\u0E32\u0E28\u0E31\u0E22\u0E15\u0E31\u0E27\u0E01\u0E25\u0E32\u0E07\u0E17\u0E35\u0E48\u0E21\u0E35\u0E21\u0E27\u0E25\u0E43\u0E19\u0E01\u0E32\u0E23\u0E2A\u0E48\u0E07\u0E1C\u0E48\u0E32\u0E19\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19",
            "\u0E40\u0E27\u0E01\u0E40\u0E15\u0E2D\u0E23\u0E4C\u0E2A\u0E19\u0E32\u0E21\u0E44\u0E1F\u0E1F\u0E49\u0E32 E \u0E41\u0E25\u0E30\u0E2A\u0E19\u0E32\u0E21\u0E41\u0E21\u0E48\u0E40\u0E2B\u0E25\u0E47\u0E01 B \u0E21\u0E35\u0E40\u0E1F\u0E2A\u0E15\u0E23\u0E07\u0E01\u0E31\u0E19\u0E17\u0E38\u0E01\u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07"
          ],
          correctChoiceIndex: 2,
          explanation: '\u0E04\u0E25\u0E37\u0E48\u0E19\u0E41\u0E21\u0E48\u0E40\u0E2B\u0E25\u0E47\u0E01\u0E44\u0E1F\u0E1F\u0E49\u0E32\u0E40\u0E1B\u0E47\u0E19\u0E04\u0E25\u0E37\u0E48\u0E19\u0E44\u0E21\u0E48\u0E2D\u0E32\u0E28\u0E31\u0E22\u0E15\u0E31\u0E27\u0E01\u0E25\u0E32\u0E07 \u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E40\u0E04\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E17\u0E35\u0E48\u0E1C\u0E48\u0E32\u0E19\u0E2A\u0E38\u0E0D\u0E0D\u0E32\u0E01\u0E32\u0E28\u0E44\u0E14\u0E49 \u0E01\u0E32\u0E23\u0E01\u0E25\u0E48\u0E32\u0E27\u0E27\u0E48\u0E32 "\u0E08\u0E33\u0E40\u0E1B\u0E47\u0E19\u0E15\u0E49\u0E2D\u0E07\u0E2D\u0E32\u0E28\u0E31\u0E22\u0E15\u0E31\u0E27\u0E01\u0E25\u0E32\u0E07" \u0E08\u0E36\u0E07\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07'
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
      const q1 = {
        id: "exam_q1",
        type: "choice",
        topic: "18.1 \u0E17\u0E24\u0E29\u0E0E\u0E35\u0E04\u0E25\u0E37\u0E48\u0E19\u0E41\u0E21\u0E48\u0E40\u0E2B\u0E25\u0E47\u0E01\u0E44\u0E1F\u0E1F\u0E49\u0E32",
        title: "\u0E02\u0E49\u0E2D 1: \u0E17\u0E24\u0E29\u0E0E\u0E35\u0E04\u0E25\u0E37\u0E48\u0E19\u0E41\u0E21\u0E48\u0E40\u0E2B\u0E25\u0E47\u0E01\u0E44\u0E1F\u0E1F\u0E49\u0E32",
        problemText: selectedTheory.problemText,
        choices: selectedTheory.choices,
        correctChoiceIndex: selectedTheory.correctChoiceIndex,
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
              `\\(\\lambda = \\frac{c}{f} = \\frac{3.00 \\times 10^8}{${formatScientific(freqHz)}} = ${lambda.toFixed(2)} \\text{ m}\\)`
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
              `\\(f = \\frac{c}{\\lambda} = \\frac{3.00 \\times 10^8}{${lambdaM.toFixed(2)}} = ${formatScientific(freqHz)} \\text{ Hz}\\)`,
              `\u0E41\u0E1B\u0E25\u0E07\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E40\u0E1B\u0E47\u0E19 MHz: \\(f_{\\text{MHz}} = \\frac{${formatScientific(freqHz)}}{10^6} = ${freqMHz.toFixed(2)} \\text{ MHz}\\)`
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
            problemText: `\u0E2A\u0E32\u0E22\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E41\u0E1A\u0E1A\u0E44\u0E14\u0E42\u0E1E\u0E25\u0E04\u0E23\u0E36\u0E48\u0E07\u0E04\u0E25\u0E37\u0E48\u0E19 (Half-wave Dipole) \u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E1A \\(L = \\lambda/2\\) \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E23\u0E31\u0E1A\u0E04\u0E25\u0E37\u0E48\u0E19\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48 \\(f = ${freqMHz.toFixed(1)} \\text{ MHz}\\) \u0E43\u0E19\u0E2A\u0E38\u0E0D\u0E0D\u0E32\u0E01\u0E32\u0E28 \u0E08\u0E07\u0E2B\u0E32\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E02\u0E2D\u0E07\u0E2A\u0E32\u0E22\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E19\u0E35\u0E49\u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E40\u0E21\u0E15\u0E23 (m)`,
            unit: "m",
            correctAnswer: Math.round(antennaL * 100) / 100,
            solutionSteps: [
              `\\(\\lambda = \\frac{c}{f} = \\frac{3.00 \\times 10^8}{${formatScientific(freqHz)}} = ${lambda.toFixed(2)} \\text{ m}\\)`,
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
              `\\(E = hf = (6.626 \\times 10^{-34}) \\times (${freqFactor.toFixed(2)} \\times 10^{14}) = ${formatScientific(energyObj.joules)} \\text{ J}\\)`,
              `\\(E_{\\text{eV}} = \\frac{${formatScientific(energyObj.joules)}}{1.602 \\times 10^{-19}} = ${energyObj.electronVolts.toFixed(2)} \\text{ eV}\\)`
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
              `\\(E_{\\text{J}} = ${energyEV.toFixed(2)} \\times 1.602 \\times 10^{-19} = ${formatScientific(energyJ)} \\text{ J}\\)`,
              `\\(f = \\frac{E}{h} = \\frac{${formatScientific(energyJ)}}{6.626 \\times 10^{-34}} = ${freqFactor.toFixed(2)} \\times 10^{14} \\text{ Hz}\\)`
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
              `\\(f = \\frac{c}{\\lambda} = \\frac{3.00 \\times 10^8}{${Math.round(lambdaNm)} \\times 10^{-9}} = ${formatScientific(freqHz)} \\text{ Hz}\\)`,
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
              `\\(I_1 = \\frac{I_0}{2} = 50\\%\\)`,
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
              `\\(I_1 = \\frac{I_0}{2} = \\frac{80}{2} = 40\\%\\)`,
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
        problemText: `\u0E2A\u0E32\u0E22\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E41\u0E1A\u0E1A\u0E42\u0E21\u0E42\u0E19\u0E42\u0E1E\u0E25 (Quarter-wave Monopole) \u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E1A \\(1/4\\) \u0E02\u0E2D\u0E07\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E04\u0E25\u0E37\u0E48\u0E19 (\\(L = \\lambda/4\\)) \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E23\u0E31\u0E1A\u0E04\u0E25\u0E37\u0E48\u0E19\u0E04\u0E27\u0E32\u0E21\u0E16\u0E35\u0E48 \\(f = ${freq5MHz.toFixed(1)} \\text{ MHz}\\) \u0E43\u0E19\u0E2A\u0E38\u0E0D\u0E0D\u0E32\u0E01\u0E32\u0E28 (\\(c = 3.00 \\times 10^8 \\text{ m/s}\\)) \u0E08\u0E07\u0E2B\u0E32\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E02\u0E2D\u0E07\u0E2A\u0E32\u0E22\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E19\u0E35\u0E49\u0E43\u0E19\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E40\u0E21\u0E15\u0E23 (m)`,
        unit: "m",
        correctAnswer: Math.round(antennaLen * 100) / 100,
        solutionSteps: [
          `\\(\\lambda = \\frac{c}{f} = \\frac{3.00 \\times 10^8}{${formatScientific(freq5Hz)}} = ${lambda5.toFixed(2)} \\text{ m}\\)`,
          `\\(L = \\frac{\\lambda}{4} = \\frac{${lambda5.toFixed(2)}}{4} = ${antennaLen.toFixed(2)} \\text{ m}\\)`
        ]
      };
      return [q1, q2, q3, q4, q5];
    }
  };

  // src/adapters/ui/exam-ui.js
  var ExamUIAdapter = class {
    /**
     * @param {HTMLElement} containerElement - Container element for exam UI
     */
    constructor(containerElement) {
      this.container = containerElement;
      this.examManager = new ExamManager(1);
      this.activeQuestionIdx = 0;
      this.examManager.onTickCallback = (secondsLeft, timerStr) => {
        this.updateTimerDisplay(secondsLeft, timerStr);
      };
      this.examManager.onStateChangeCallback = (state, result) => {
        this.renderState(state, result);
        TabNavigatorAdapter.setExamInProgress(state === EXAM_STATES.IN_PROGRESS);
      };
      this.setupReloadProtection();
      const savedResult = LocalStorageAdapter.loadExamResult();
      if (savedResult) {
        this.examManager.examResult = savedResult;
        this.renderState(EXAM_STATES.REVIEW, savedResult);
      } else {
        this.renderState(EXAM_STATES.IDLE);
      }
    }
    /**
     * Setup browser reload protection (F5 / Ctrl+R / beforeunload)
     */
    setupReloadProtection() {
      if (typeof window === "undefined") return;
      window.addEventListener("keydown", (e) => {
        if (this.examManager.state === EXAM_STATES.IN_PROGRESS) {
          const isR = e.key === "r" || e.key === "R" || e.keyCode === 82;
          const isF5 = e.key === "F5" || e.keyCode === 116;
          if (isF5 || isR && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            alert("\u26A0\uFE0F \u0E04\u0E38\u0E13\u0E01\u0E33\u0E25\u0E31\u0E07\u0E08\u0E30\u0E1E\u0E22\u0E32\u0E22\u0E32\u0E21\u0E17\u0E38\u0E08\u0E23\u0E34\u0E15\u0E01\u0E32\u0E23\u0E2A\u0E2D\u0E1A!\n\u0E23\u0E30\u0E1A\u0E1A\u0E17\u0E33\u0E01\u0E32\u0E23\u0E25\u0E47\u0E2D\u0E04\u0E01\u0E32\u0E23\u0E01\u0E14\u0E23\u0E35\u0E42\u0E2B\u0E25\u0E14\u0E2B\u0E19\u0E49\u0E32\u0E08\u0E2D\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07\u0E01\u0E32\u0E23\u0E17\u0E33\u0E02\u0E49\u0E2D\u0E2A\u0E2D\u0E1A");
            return false;
          }
        }
      }, true);
      window.addEventListener("contextmenu", (e) => {
        if (this.examManager.state === EXAM_STATES.IN_PROGRESS) {
          e.preventDefault();
          alert("\u26A0\uFE0F \u0E04\u0E38\u0E13\u0E01\u0E33\u0E25\u0E31\u0E07\u0E08\u0E30\u0E1E\u0E22\u0E32\u0E22\u0E32\u0E21\u0E17\u0E38\u0E08\u0E23\u0E34\u0E15\u0E01\u0E32\u0E23\u0E2A\u0E2D\u0E1A!\n\u0E23\u0E30\u0E1A\u0E1A\u0E17\u0E33\u0E01\u0E32\u0E23\u0E25\u0E47\u0E2D\u0E04\u0E04\u0E25\u0E34\u0E01\u0E02\u0E27\u0E32\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E1B\u0E49\u0E2D\u0E07\u0E01\u0E31\u0E19\u0E01\u0E32\u0E23\u0E23\u0E35\u0E42\u0E2B\u0E25\u0E14\u0E2B\u0E19\u0E49\u0E32\u0E08\u0E2D\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07\u0E17\u0E33\u0E02\u0E49\u0E2D\u0E2A\u0E2D\u0E1A");
          return false;
        }
      }, true);
      window.addEventListener("beforeunload", (e) => {
        if (this.examManager.state === EXAM_STATES.IN_PROGRESS) {
          this.examManager.submitExam(true);
          const warningMsg = "\u26A0\uFE0F \u0E04\u0E38\u0E13\u0E01\u0E33\u0E25\u0E31\u0E07\u0E08\u0E30\u0E1E\u0E22\u0E32\u0E22\u0E32\u0E21\u0E17\u0E38\u0E08\u0E23\u0E34\u0E15\u0E01\u0E32\u0E23\u0E2A\u0E2D\u0E1A! \u0E2B\u0E32\u0E01\u0E04\u0E38\u0E13\u0E23\u0E35\u0E42\u0E2B\u0E25\u0E14\u0E2B\u0E23\u0E37\u0E2D\u0E2D\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E2B\u0E19\u0E49\u0E32\u0E19\u0E35\u0E49 \u0E02\u0E49\u0E2D\u0E2A\u0E2D\u0E1A\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13\u0E08\u0E30\u0E16\u0E39\u0E01\u0E2A\u0E48\u0E07\u0E41\u0E25\u0E30\u0E22\u0E38\u0E15\u0E34\u0E01\u0E32\u0E23\u0E2A\u0E2D\u0E1A\u0E17\u0E31\u0E19\u0E17\u0E35!";
          e.preventDefault();
          e.returnValue = warningMsg;
          return warningMsg;
        }
      });
    }
    /**
     * Render view based on state machine
     */
    renderState(state, data = null) {
      if (!this.container) return;
      switch (state) {
        case EXAM_STATES.IN_PROGRESS:
          this.renderActiveExamView();
          break;
        case EXAM_STATES.SUBMITTED:
        case EXAM_STATES.REVIEW:
          this.renderDashboardView(data || this.examManager.examResult);
          break;
        case EXAM_STATES.IDLE:
        default:
          this.renderStartScreenView();
          break;
      }
    }
    /**
     * 1. Start Screen View (Strict 7-Step Layout per Timed-Exam-System-Rules.md)
     */
    renderStartScreenView() {
      const defaultName = this.examManager.fullName || "";
      const defaultClass = this.examManager.className || "\u0E21.6/1";
      const defaultRoll = this.examManager.rollNumber || 1;
      this.container.innerHTML = `
      <div class="glass-panel p-6 sm:p-8 space-y-6 max-w-3xl mx-auto text-left border-t-4 border-t-emerald-500 animate-fade-in">
        
        <!-- Step 1: Assessment Icon & Subject Marker -->
        <div class="flex items-center gap-4 border-b border-slate-800 pb-4">
          <div class="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-3xl shrink-0 shadow-lg shadow-emerald-500/10">
            \u{1F393}
          </div>
          <div>
            <!-- Step 2: Exam Title -->
            <h2 class="text-2xl font-bold text-white tracking-tight">\u0E17\u0E14\u0E2A\u0E2D\u0E1A\u0E40\u0E01\u0E47\u0E1A\u0E04\u0E30\u0E41\u0E19\u0E19 \u0E21.6</h2>
            <!-- Step 3: Subtitle -->
            <p class="text-slate-400 text-sm mt-0.5 font-medium">
              \u0E1A\u0E17\u0E17\u0E35\u0E48 18 \u0E04\u0E25\u0E37\u0E48\u0E19\u0E41\u0E21\u0E48\u0E40\u0E2B\u0E25\u0E47\u0E01\u0E44\u0E1F\u0E1F\u0E49\u0E32 (18.1 - 18.3)
            </p>
          </div>
        </div>

        <!-- Step 4: Rules Warning Panel (Visible BEFORE identity form & start button) -->
        <div class="bg-gradient-to-r from-red-950/60 via-slate-900/90 to-amber-950/40 border border-red-500/40 rounded-xl p-5 space-y-3 shadow-lg shadow-red-950/20">
          <div class="flex items-center gap-2 text-red-400 font-bold text-base border-b border-red-500/20 pb-2">
            <span>\u{1F6A8}</span> <span>\u0E01\u0E15\u0E34\u0E01\u0E32\u0E01\u0E32\u0E23\u0E2A\u0E2D\u0E1A (\u0E2D\u0E48\u0E32\u0E19\u0E01\u0E48\u0E2D\u0E19\u0E40\u0E23\u0E34\u0E48\u0E21):</span>
          </div>
          <ul class="space-y-2 text-xs sm:text-sm text-slate-200 leading-relaxed list-none">
            <li class="flex items-start gap-2">
              <span class="text-red-400 font-bold">\u2022</span>
              <span>\u0E21\u0E35\u0E02\u0E49\u0E2D\u0E2A\u0E2D\u0E1A\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14 <strong>5 \u0E02\u0E49\u0E2D</strong> \u0E02\u0E49\u0E2D\u0E25\u0E30 2 \u0E04\u0E30\u0E41\u0E19\u0E19 (\u0E04\u0E30\u0E41\u0E19\u0E19\u0E40\u0E15\u0E47\u0E21 <strong>10 \u0E04\u0E30\u0E41\u0E19\u0E19</strong>)</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-red-400 font-bold">\u2022</span>
              <span>\u0E02\u0E2D\u0E1A\u0E40\u0E02\u0E15\u0E40\u0E19\u0E37\u0E49\u0E2D\u0E2B\u0E32: 18.1 \u0E01\u0E32\u0E23\u0E40\u0E01\u0E34\u0E14\u0E04\u0E25\u0E37\u0E48\u0E19\u0E41\u0E21\u0E48\u0E40\u0E2B\u0E25\u0E47\u0E01\u0E44\u0E1F\u0E1F\u0E49\u0E32, 18.2 \u0E2A\u0E40\u0E1B\u0E01\u0E15\u0E23\u0E31\u0E21\u0E04\u0E25\u0E37\u0E48\u0E19\u0E41\u0E21\u0E48\u0E40\u0E2B\u0E25\u0E47\u0E01\u0E44\u0E1F\u0E1F\u0E49\u0E32 (\\(E = hf\\)), 18.3 \u0E42\u0E1E\u0E25\u0E32\u0E44\u0E23\u0E40\u0E0B\u0E0A\u0E31\u0E19 (\\(I = I_0 \\cos^2 \\theta\\))</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-red-400 font-bold">\u2022</span>
              <span>\u0E21\u0E35\u0E23\u0E30\u0E22\u0E30\u0E40\u0E27\u0E25\u0E32\u0E08\u0E33\u0E01\u0E31\u0E14\u0E43\u0E19\u0E01\u0E32\u0E23\u0E17\u0E33\u0E02\u0E49\u0E2D\u0E2A\u0E2D\u0E1A <strong>15 \u0E19\u0E32\u0E17\u0E35</strong> (\u0E19\u0E31\u0E1A\u0E16\u0E2D\u0E22\u0E2B\u0E25\u0E31\u0E07)</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-red-400 font-bold">\u2022</span>
              <span>\u0E01\u0E32\u0E23\u0E15\u0E2D\u0E1A\u0E04\u0E33\u0E16\u0E32\u0E21\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E04\u0E33\u0E19\u0E27\u0E13\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02 \u0E43\u0E2B\u0E49\u0E1B\u0E49\u0E2D\u0E19\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E40\u0E1B\u0E47\u0E19\u0E17\u0E28\u0E19\u0E34\u0E22\u0E21\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E19 <strong>2 \u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07</strong></span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-red-400 font-bold">\u2022</span>
              <span class="text-red-300 font-semibold">\u0E2B\u0E49\u0E32\u0E21\u0E23\u0E35\u0E40\u0E1F\u0E23\u0E0A\u0E2B\u0E19\u0E49\u0E32\u0E08\u0E2D\u0E2B\u0E23\u0E37\u0E2D\u0E2A\u0E25\u0E31\u0E1A\u0E41\u0E17\u0E47\u0E1A \u0E21\u0E34\u0E09\u0E30\u0E19\u0E31\u0E49\u0E19\u0E23\u0E30\u0E1A\u0E1A\u0E08\u0E30\u0E17\u0E33\u0E01\u0E32\u0E23\u0E25\u0E47\u0E2D\u0E04\u0E41\u0E25\u0E30\u0E2A\u0E48\u0E07\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E2D\u0E31\u0E15\u0E42\u0E19\u0E21\u0E31\u0E15\u0E34 (\u0E16\u0E37\u0E2D\u0E27\u0E48\u0E32\u0E1E\u0E22\u0E32\u0E22\u0E32\u0E21\u0E17\u0E38\u0E08\u0E23\u0E34\u0E15\u0E01\u0E32\u0E23\u0E2A\u0E2D\u0E1A)</span>
            </li>
          </ul>
        </div>

        <!-- Step 5: Learner Identity Form -->
        <div class="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-4">
          <h3 class="text-sm font-bold text-slate-200 flex items-center gap-2">
            <span>\u{1F464}</span> <span>\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1C\u0E39\u0E49\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E2D\u0E1A:</span>
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Full Name -->
            <div class="space-y-1.5 md:col-span-1">
              <label for="input-exam-name" class="block text-xs font-semibold text-slate-300">
                \u0E0A\u0E37\u0E48\u0E2D-\u0E19\u0E32\u0E21\u0E2A\u0E01\u0E38\u0E25\u0E1C\u0E39\u0E49\u0E2A\u0E2D\u0E1A <span class="text-red-400">*</span>:
              </label>
              <input type="text" id="input-exam-name" value="${defaultName}" placeholder="\u0E23\u0E30\u0E1A\u0E38\u0E0A\u0E37\u0E48\u0E2D\u0E08\u0E23\u0E34\u0E07 \u0E19\u0E32\u0E21\u0E2A\u0E01\u0E38\u0E25"
                class="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:outline-none transition-colors" />
            </div>

            <!-- Room Select (\u0E21.6/1 - \u0E21.6/5) -->
            <div class="space-y-1.5">
              <label for="select-exam-class" class="block text-xs font-semibold text-slate-300">
                \u0E0A\u0E31\u0E49\u0E19 \u0E21.6 / \u0E2B\u0E49\u0E2D\u0E07 <span class="text-red-400">*</span>:
              </label>
              <select id="select-exam-class"
                class="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:outline-none transition-colors">
                <option value="\u0E21.6/1" ${defaultClass === "\u0E21.6/1" ? "selected" : ""}>\u0E21.6/1</option>
                <option value="\u0E21.6/2" ${defaultClass === "\u0E21.6/2" ? "selected" : ""}>\u0E21.6/2</option>
                <option value="\u0E21.6/3" ${defaultClass === "\u0E21.6/3" ? "selected" : ""}>\u0E21.6/3</option>
                <option value="\u0E21.6/4" ${defaultClass === "\u0E21.6/4" ? "selected" : ""}>\u0E21.6/4</option>
                <option value="\u0E21.6/5" ${defaultClass === "\u0E21.6/5" ? "selected" : ""}>\u0E21.6/5</option>
              </select>
            </div>

            <!-- Student Roll Number -->
            <div class="space-y-1.5">
              <label for="input-exam-roll" class="block text-xs font-semibold text-slate-300">
                \u0E40\u0E25\u0E02\u0E17\u0E35\u0E48 <span class="text-red-400">*</span>:
              </label>
              <input type="number" id="input-exam-roll" min="1" max="40" value="${defaultRoll}" placeholder="1-40"
                class="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono font-bold text-sm focus:border-emerald-500 focus:outline-none transition-colors" />
            </div>
          </div>

          <div id="exam-identity-error" class="hidden text-xs text-red-400 font-semibold pt-1">
            \u26A0\uFE0F \u0E01\u0E23\u0E38\u0E13\u0E32\u0E01\u0E23\u0E2D\u0E01\u0E0A\u0E37\u0E48\u0E2D-\u0E19\u0E32\u0E21\u0E2A\u0E01\u0E38\u0E25 \u0E40\u0E25\u0E37\u0E2D\u0E01\u0E2B\u0E49\u0E2D\u0E07\u0E40\u0E23\u0E35\u0E22\u0E19 \u0E41\u0E25\u0E30\u0E23\u0E30\u0E1A\u0E38\u0E40\u0E25\u0E02\u0E17\u0E35\u0E48\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07 1-40 \u0E43\u0E2B\u0E49\u0E04\u0E23\u0E1A\u0E16\u0E49\u0E27\u0E19\u0E01\u0E48\u0E2D\u0E19\u0E40\u0E23\u0E34\u0E48\u0E21\u0E17\u0E33\u0E02\u0E49\u0E2D\u0E2A\u0E2D\u0E1A
          </div>
        </div>

        <!-- Step 6 & Step 7: Actions (Back & Start Button) -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <!-- Step 6: Back or Cancel Action -->
          <button id="btn-back-to-review" class="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors border border-slate-700 flex items-center justify-center gap-2">
            <span>\u2190</span> <span>\u0E01\u0E25\u0E31\u0E1A\u0E44\u0E1B\u0E17\u0E1A\u0E17\u0E27\u0E19\u0E1A\u0E17\u0E40\u0E23\u0E35\u0E22\u0E19</span>
          </button>

          <!-- Step 7: Primary Start Action -->
          <button id="btn-start-exam" class="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-base transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
            <span>\u{1F680}</span> <span>\u0E40\u0E23\u0E34\u0E48\u0E21\u0E17\u0E33\u0E02\u0E49\u0E2D\u0E2A\u0E2D\u0E1A\u0E17\u0E31\u0E19\u0E17\u0E35</span>
          </button>
        </div>

      </div>
    `;
      this._bindStartScreenEvents();
      this.renderMathExpressions();
    }
    /**
     * Bind event listeners and real-time validation for start screen
     */
    _bindStartScreenEvents() {
      const inputName = this.container.querySelector("#input-exam-name");
      const selectClass = this.container.querySelector("#select-exam-class");
      const inputRoll = this.container.querySelector("#input-exam-roll");
      const btnStart = this.container.querySelector("#btn-start-exam");
      const btnBack = this.container.querySelector("#btn-back-to-review");
      const errorBox = this.container.querySelector("#exam-identity-error");
      const validateForm = () => {
        const nameVal = inputName ? inputName.value.trim() : "";
        const classVal = selectClass ? selectClass.value : "";
        const rollVal = inputRoll ? parseInt(inputRoll.value, 10) : 0;
        const isValid = nameVal.length > 0 && classVal.length > 0 && rollVal >= 1 && rollVal <= 40;
        if (btnStart) {
          btnStart.disabled = !isValid;
          if (isValid) {
            btnStart.className = "w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-base transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3 cursor-pointer";
          } else {
            btnStart.className = "w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-800 text-slate-500 font-bold text-base transition-all border border-slate-700 flex items-center justify-center gap-3 cursor-not-allowed opacity-60";
          }
        }
        return isValid;
      };
      if (inputName) inputName.addEventListener("input", validateForm);
      if (selectClass) selectClass.addEventListener("change", validateForm);
      if (inputRoll) inputRoll.addEventListener("input", validateForm);
      validateForm();
      if (btnStart) {
        btnStart.addEventListener("click", () => {
          const nameVal = inputName ? inputName.value.trim() : "";
          const classVal = selectClass ? selectClass.value : "\u0E21.6/1";
          const rollVal = inputRoll ? parseInt(inputRoll.value, 10) : 1;
          if (!validateForm()) {
            if (errorBox) errorBox.classList.remove("hidden");
            return;
          }
          if (errorBox) errorBox.classList.add("hidden");
          this.examManager.setIdentity(nameVal, classVal, rollVal);
          this.examManager.startExam();
        });
      }
      if (btnBack) {
        btnBack.addEventListener("click", () => {
          TabNavigatorAdapter.switchToTab("tab-review");
        });
      }
    }
    /**
     * 2. Active Exam View
     */
    renderActiveExamView() {
      const q = this.examManager.questions[this.activeQuestionIdx];
      if (!q) return;
      this.container.innerHTML = `
      <div class="space-y-6">
        
        <!-- Active Exam Header Bar -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <!-- Question Status Pills -->
          <div class="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            ${this.examManager.questions.map((_, idx) => {
        const isAnswered = this.examManager.userAnswers[idx] !== void 0 && this.examManager.userAnswers[idx] !== "";
        const isActive = idx === this.activeQuestionIdx;
        let btnClass = "bg-slate-800 text-slate-400 border-slate-700";
        if (isAnswered) btnClass = "bg-emerald-950/80 text-emerald-300 border-emerald-500/40";
        if (isActive) btnClass = "bg-blue-600 text-white border-blue-400 ring-2 ring-blue-500/50";
        return `<button class="exam-q-pill px-3 py-1.5 rounded-lg text-xs font-bold font-mono border transition-all ${btnClass}" data-idx="${idx}">
                        \u0E02\u0E49\u0E2D\u0E17\u0E35\u0E48 ${idx + 1} ${isAnswered ? "\u2713" : ""}
                      </button>`;
      }).join("")}
          </div>

          <!-- Timer & Submit Actions -->
          <div class="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <div id="active-exam-timer" class="text-xl font-bold font-mono text-emerald-400 bg-slate-950 px-3.5 py-1.5 rounded-lg border border-slate-800">
              ${this.examManager.formatTimerString()}
            </div>
            <button id="btn-submit-exam-now" class="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors shadow-lg shadow-red-600/20">
              \u0E2A\u0E48\u0E07\u0E02\u0E49\u0E2D\u0E2A\u0E2D\u0E1A
            </button>
          </div>
        </div>

        <!-- Question Card -->
        <div class="glass-panel p-6 space-y-6 border-l-4 border-l-blue-500 animate-fade-in">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <span class="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">${q.topic}</span>
            <span class="text-xs font-mono text-amber-400 font-bold">2 \u0E04\u0E30\u0E41\u0E19\u0E19</span>
          </div>

          <h3 class="text-lg font-bold text-white">${q.title}</h3>
          
          <div id="exam-problem-text" class="text-slate-200 text-base leading-relaxed bg-slate-900/60 p-5 rounded-xl border border-slate-800">
            ${q.problemText}
          </div>

          <!-- Input Area (Choice vs Numeric) -->
          <div id="exam-input-area" class="bg-slate-900/40 p-5 rounded-xl border border-slate-800">
            ${q.type === "choice" ? this._renderChoiceInput(q) : this._renderNumericInput(q)}
          </div>

          <!-- Question Navigation Buttons -->
          <div class="flex items-center justify-between pt-2">
            <button id="btn-prev-q" class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition-colors ${this.activeQuestionIdx === 0 ? "opacity-50 pointer-events-none" : ""}">
              \u2190 \u0E02\u0E49\u0E2D\u0E01\u0E48\u0E2D\u0E19\u0E2B\u0E19\u0E49\u0E32
            </button>
            <button id="btn-next-q" class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors ${this.activeQuestionIdx === 4 ? "hidden" : ""}">
              \u0E02\u0E49\u0E2D\u0E16\u0E31\u0E14\u0E44\u0E1B \u2192
            </button>
          </div>
        </div>

      </div>
    `;
      this._bindActiveExamEvents();
      this.renderMathExpressions();
    }
    /**
     * Render Choice Input for Theory Question
     */
    _renderChoiceInput(q) {
      const selectedIdx = this.examManager.userAnswers[this.activeQuestionIdx];
      return `
      <div class="space-y-3">
        ${q.choices.map((choiceText, cIdx) => {
        const isChecked = String(selectedIdx) === String(cIdx);
        return `
            <label class="flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${isChecked ? "bg-blue-950/60 border-blue-500 text-white" : "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800"}">
              <input type="radio" name="exam-choice" value="${cIdx}" ${isChecked ? "checked" : ""} class="w-4 h-4 text-blue-600 focus:ring-blue-500" />
              <span class="text-sm">${choiceText}</span>
            </label>
          `;
      }).join("")}
      </div>
    `;
    }
    /**
     * Render Numeric Input for Calculation Questions
     */
    _renderNumericInput(q) {
      const currentVal = this.examManager.userAnswers[this.activeQuestionIdx] || "";
      return `
      <div class="flex items-center gap-3 max-w-md">
        <label for="input-exam-numeric" class="text-sm font-semibold text-slate-300 whitespace-nowrap">
          \u0E04\u0E33\u0E15\u0E2D\u0E1A:
        </label>
        <input type="number" id="input-exam-numeric" step="any" value="${currentVal}" placeholder="\u0E01\u0E23\u0E2D\u0E01\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E04\u0E33\u0E15\u0E2D\u0E1A..."
          class="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono font-bold text-lg focus:border-blue-500 focus:outline-none" />
        <span class="text-sm font-bold text-blue-400 bg-blue-950/60 px-3 py-2.5 rounded-lg border border-blue-800/60 font-mono">
          ${q.unit}
        </span>
      </div>
    `;
    }
    /**
     * Bind Active Exam events
     */
    _bindActiveExamEvents() {
      const qPills = this.container.querySelectorAll(".exam-q-pill");
      qPills.forEach((btn) => {
        btn.addEventListener("click", () => {
          this.activeQuestionIdx = parseInt(btn.getAttribute("data-idx"), 10);
          this.renderActiveExamView();
        });
      });
      const choiceInputs = this.container.querySelectorAll('input[name="exam-choice"]');
      choiceInputs.forEach((radio) => {
        radio.addEventListener("change", (e) => {
          this.examManager.recordAnswer(this.activeQuestionIdx, e.target.value);
          this.renderActiveExamView();
        });
      });
      const numericInput = this.container.querySelector("#input-exam-numeric");
      if (numericInput) {
        numericInput.addEventListener("input", (e) => {
          this.examManager.recordAnswer(this.activeQuestionIdx, e.target.value);
        });
      }
      const btnPrev = this.container.querySelector("#btn-prev-q");
      if (btnPrev) {
        btnPrev.addEventListener("click", () => {
          if (this.activeQuestionIdx > 0) {
            this.activeQuestionIdx--;
            this.renderActiveExamView();
          }
        });
      }
      const btnNext = this.container.querySelector("#btn-next-q");
      if (btnNext) {
        btnNext.addEventListener("click", () => {
          if (this.activeQuestionIdx < 4) {
            this.activeQuestionIdx++;
            this.renderActiveExamView();
          }
        });
      }
      const btnSubmit = this.container.querySelector("#btn-submit-exam-now");
      if (btnSubmit) {
        btnSubmit.addEventListener("click", () => {
          if (confirm("\u0E04\u0E38\u0E13\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E01\u0E32\u0E23\u0E2A\u0E48\u0E07\u0E02\u0E49\u0E2D\u0E2A\u0E2D\u0E1A\u0E40\u0E01\u0E47\u0E1A\u0E04\u0E30\u0E41\u0E19\u0E19\u0E43\u0E0A\u0E48\u0E2B\u0E23\u0E37\u0E2D\u0E44\u0E21\u0E48?")) {
            this.examManager.submitExam(false);
          }
        });
      }
    }
    /**
     * Update active timer string
     */
    updateTimerDisplay(secondsLeft, timerStr) {
      const timerBox = this.container.querySelector("#active-exam-timer");
      const headerTimerBox = document.getElementById("exam-timer-display");
      if (timerBox) {
        timerBox.textContent = timerStr;
        if (secondsLeft < 180) {
          timerBox.className = "text-xl font-bold font-mono text-red-400 bg-red-950/80 px-3.5 py-1.5 rounded-lg border border-red-800 animate-pulse";
        }
      }
      if (headerTimerBox) {
        headerTimerBox.textContent = timerStr;
        if (secondsLeft < 180) {
          headerTimerBox.className = "text-2xl font-bold font-mono text-red-400 bg-slate-900 px-4 py-2 rounded-xl border border-red-800 animate-pulse";
        }
      }
    }
    /**
     * 3. Score Dashboard & Review View
     */
    renderDashboardView(res) {
      if (!res) return;
      const isPass = res.totalScore >= 6;
      this.container.innerHTML = `
      <div class="space-y-8 animate-fade-in">
        
        <!-- Score Overview Card -->
        <div class="glass-panel p-6 border-t-4 ${isPass ? "border-t-emerald-500" : "border-t-amber-500"} grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div class="text-center md:text-left space-y-1">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">\u0E2A\u0E23\u0E38\u0E1B\u0E1C\u0E25\u0E01\u0E32\u0E23\u0E2A\u0E2D\u0E1A\u0E40\u0E01\u0E47\u0E1A\u0E04\u0E30\u0E41\u0E19\u0E19</span>
            <h3 class="text-xl font-bold text-white">${res.fullName || "\u0E1C\u0E39\u0E49\u0E2A\u0E2D\u0E1A"} (${res.className || "\u0E21.6/1"})</h3>
            <p class="text-xs text-slate-300 font-medium">\u0E40\u0E25\u0E02\u0E17\u0E35\u0E48: <span class="font-mono text-emerald-400 font-bold">#${res.rollNumber}</span> | \u0E43\u0E0A\u0E49\u0E40\u0E27\u0E25\u0E32\u0E2A\u0E2D\u0E1A: ${res.formattedTimeTaken}</p>
            <p class="text-xs text-slate-400 font-medium flex items-center gap-1.5 justify-center md:justify-start pt-0.5">
              <span>\u{1F4C5}</span> <span>\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E2A\u0E2D\u0E1A: ${res.formattedSubmittedAt || "2 \u0E2A.\u0E04. 2569 \u0E40\u0E27\u0E25\u0E32 12:46 \u0E19."}</span>
            </p>
          </div>

          <!-- Total Score Gauge -->
          <div class="flex items-center justify-center gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div class="text-center">
              <div class="text-4xl font-extrabold ${isPass ? "text-emerald-400" : "text-amber-400"} font-mono">${res.totalScore}</div>
              <div class="text-xs text-slate-400 mt-1">\u0E04\u0E30\u0E41\u0E19\u0E19\u0E40\u0E15\u0E47\u0E21 10</div>
            </div>
            <div class="h-10 w-px bg-slate-800"></div>
            <div class="text-center">
              <div class="text-2xl font-bold text-white font-mono">${res.percentage.toFixed(0)}%</div>
              <div class="text-xs ${isPass ? "text-emerald-400" : "text-amber-400"} font-semibold mt-1">
                ${isPass ? "\u0E1C\u0E48\u0E32\u0E19\u0E40\u0E01\u0E13\u0E11\u0E4C \u{1F389}" : "\u0E04\u0E27\u0E23\u0E17\u0E1A\u0E17\u0E27\u0E19 \u26A0\uFE0F"}
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-center">
            <button id="btn-retake-exam" class="w-full px-5 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
              <span>\u{1F504}</span> <span>\u0E40\u0E23\u0E34\u0E48\u0E21\u0E2A\u0E2D\u0E1A\u0E43\u0E2B\u0E21\u0E48\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07</span>
            </button>
          </div>
        </div>

        <!-- Question Breakdown List -->
        <div class="space-y-6">
          <h4 class="text-lg font-bold text-white flex items-center gap-2">
            <span>\u{1F4CB}</span> \u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E1C\u0E25\u0E01\u0E32\u0E23\u0E15\u0E2D\u0E1A\u0E23\u0E32\u0E22\u0E02\u0E49\u0E2D (Question Review):
          </h4>

          ${res.gradedQuestions.map((q, idx) => `
            <div class="glass-panel p-5 space-y-4 border-l-4 ${q.isCorrect ? "border-l-emerald-500" : "border-l-red-500"}">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">\u0E02\u0E49\u0E2D\u0E17\u0E35\u0E48 ${idx + 1}</span>
                  <span class="text-xs text-slate-400">${q.topic}</span>
                </div>
                <span class="text-xs font-bold font-mono ${q.isCorrect ? "text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800" : "text-red-400 bg-red-950/60 px-2.5 py-1 rounded border border-red-800"}">
                  ${q.scoreObtained} / 2 \u0E04\u0E30\u0E41\u0E19\u0E19
                </span>
              </div>

              <h5 class="text-base font-bold text-white">${q.title}</h5>
              <div id="exam-problem-text-${idx}" class="text-sm text-slate-300 bg-slate-900/50 p-4 rounded-lg leading-relaxed">
                ${q.problemText}
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div class="p-3 rounded-lg ${q.isCorrect ? "bg-emerald-950/30 border border-emerald-800/40 text-emerald-200" : "bg-red-950/30 border border-red-800/40 text-red-200"}">
                  \u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13: <span class="font-bold text-sm ml-1">${q.userAnswer} ${q.unit || ""}</span>
                </div>
                <div class="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300">
                  \u0E40\u0E09\u0E25\u0E22\u0E17\u0E35\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: <span class="font-bold text-sm text-emerald-400 ml-1">${q.type === "choice" ? q.choices[q.correctChoiceIndex] : `${q.correctAnswer} ${q.unit}`}</span>
                </div>
              </div>

              <!-- Solution Steps -->
              <div class="bg-slate-900/80 p-4 rounded-lg border border-slate-800 text-xs space-y-2">
                <div class="font-bold text-amber-400">\u0E27\u0E34\u0E18\u0E35\u0E17\u0E33\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14:</div>
                <ul id="exam-solution-steps-${idx}" class="list-disc list-inside space-y-1 text-slate-300">
                  ${q.solutionSteps.map((s) => `<li>${s}</li>`).join("")}
                </ul>
              </div>
            </div>
          `).join("")}
        </div>

      </div>
    `;
      const btnRetake = this.container.querySelector("#btn-retake-exam");
      if (btnRetake) {
        btnRetake.addEventListener("click", () => {
          this.examManager.state = EXAM_STATES.IDLE;
          this.renderStartScreenView();
        });
      }
      this.renderMathExpressions();
    }
    /**
     * Render inline KaTeX math expressions \\(...\\) and $...$
     */
    renderMathExpressions() {
      if (typeof window.katex === "undefined") return;
      const textNodes = this.container.querySelectorAll('[id^="exam-problem-text"], [id^="exam-solution-steps"] li, .glass-panel li, .glass-panel p');
      textNodes.forEach((node) => {
        let html = node.innerHTML;
        html = html.replace(/\\\((.*?)\\\)/g, (match, math) => {
          try {
            return window.katex.renderToString(math, { displayMode: false, throwOnError: false });
          } catch (e) {
            return match;
          }
        });
        html = html.replace(/\$(.*?)\$/g, (match, math) => {
          try {
            return window.katex.renderToString(math, { displayMode: false, throwOnError: false });
          } catch (e) {
            return match;
          }
        });
        node.innerHTML = html;
      });
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
      const quizContainer = document.getElementById("quiz-system-container");
      let quizUI = null;
      if (quizContainer) {
        quizUI = new QuizUIAdapter(quizContainer);
      }
      const examContainer = document.getElementById("exam-system-container");
      let examUI = null;
      if (examContainer) {
        examUI = new ExamUIAdapter(examContainer);
      }
      TabNavigatorAdapter.init({
        emWaveSim,
        spectrumSim,
        polarizationSim
      });
      renderFormulaHeadings();
      console.log("[Physics Portal] All modules and simulators initialized successfully.");
    } catch (err) {
      console.error("[Physics Portal Error] Failed to initialize portal modules:", err);
    }
  });
  function renderFormulaHeadings() {
    setTimeout(() => {
      KaTeXAdapter.render(KaTeXAdapter.TEMPLATES.VECTOR_FIELD, "katex-formula-18-1");
      KaTeXAdapter.render(KaTeXAdapter.TEMPLATES.PHOTON_ENERGY, "katex-formula-18-2");
      KaTeXAdapter.render(KaTeXAdapter.TEMPLATES.MALUS_LAW, "katex-formula-18-3");
      KaTeXAdapter.renderAllMath(document.body);
    }, 100);
  }
  function verifyKaTeXLoaded() {
    if (typeof window.katex !== "undefined") {
      console.log("[KaTeX Adapter] Local KaTeX engine loaded successfully for offline formula rendering.");
    } else {
      console.warn("[KaTeX Adapter] KaTeX not found in global window context.");
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
