import React, { useState, useCallback, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { ImageFile, GeneratedResult } from './types';
import { 
    generateUgcPantsImages, 
    generateUgcTopImages, 
    generateUgcSetelanImages, 
    generateUgcTryOnImages, 
    generateUgcFabricTouchImages, 
    generateUgcSideTurnImages, 
    generateUgcMirrorCheckImages, 
    generateUgcBottomsFitCheckImages, 
    generateUgcSitStandImages, 
    generateUgcBottomsFabricImages, 
    generateUgcSideProfileFallImages, 
    generateUgcLengthProportionImages, 
    generateUgcNecklineCheck, 
    generateUgcSleeveMovement, 
    generateUgcShoulderFit, 
    generateUgcLayeringCompatibility, 
    generateUgcComfortHold, 
    generateUgcWaistHipFitCheck, 
    generateUgcThighKneeSpaceCheck, 
    generateUgcBackSeatFitCheck, 
    generateUgcHemCuffInteraction, 
    generateUgcDailyMotionPause, 
    generateUgcFullSetBalance, 
    generateUgcTopBottomTransition, 
    generateUgcMovementHarmony, 
    generateUgcCasualStyling, 
    generateUgcMirrorSetReview, 
    generateCustomImage, 
    generateBackgroundReplaceImage, 
    generateUgcCinematicImages, 
    generateAutoVideoPrompt, 
    QualityLevel, 
    TOP_CAMERA_ANGLES, 
    PANTS_CAMERA_ANGLES, 
    CINEMATIC_CAMERA_ANGLES, 
    BACKGROUND_CATEGORIES, 
    MODEL_POSES, 
    PANTS_MODEL_POSES, 
    CUTE_MODEL_POSES, 
    CINEMATIC_MODEL_POSES, 
    MIRROR_SELFIE_POSES, 
    GRASS_POSES, 
    CINEMATIC_NEW_POSES, 
    STATIC_POSES, 
    CINEMATIC_SITTING_POSES, 
    SITTING_MODEL_POSES, 
    MODEL_EXPRESSIONS, 
    CAMERA_PRESETS, 
    FOOTWEAR_OPTIONS, 
    ACCESSORY_CATEGORIES, 
    FACE_ACCESSORY_CATEGORIES 
} from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import SparklesIcon from './components/icons/SparklesIcon';
import Spinner from './components/Spinner';
import { translations } from './translations';

// --- Helper Functions ---
const generateId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// --- Types and Constants ---
type GenerationMode = 'custom' | 'ugc_smart' | 'ugc_celana' | 'ugc_atasan' | 'ugc_setelan' | 'ugc_tryon' | 'ugc_fabric_touch' | 'ugc_side_turn' | 'ugc_mirror_check' | 'ugc_neckline_check' | 'ugc_sleeve_movement' | 'ugc_shoulder_fit' | 'ugc_layering_compatibility' | 'ugc_comfort_hold' | 'ugc_waist_hip_fit' | 'ugc_thigh_knee_space' | 'ugc_back_seat_fit' | 'ugc_hem_cuff' | 'ugc_daily_motion' | 'ugc_full_set_balance' | 'ugc_top_bottom_transition' | 'ugc_movement_harmony' | 'ugc_casual_styling' | 'ugc_mirror_set_review' | 'ugc_bottoms_fit' | 'ugc_sit_stand' | 'ugc_bottoms_fabric' | 'ugc_side_profile_fall' | 'ugc_length_proportion' | 'ugc_angles' | 'ugc_angles_celana' | 'ugc_angles_cinematic' | 'background_replace';
type PoseCategory = 'normal' | 'pants' | 'cute' | 'cinematic' | 'cinematic_new' | 'mirror' | 'grass' | 'static' | 'cinematic_sitting' | 'sitting';

const PANT_TYPES = ["Jeans", "Trousers", "Leggings", "Shorts", "Cargo Pants"];
const MATERIALS = ["Denim", "Cotton", "Polyester", "Leather", "Linen"];

const TOP_TYPES = ["T-Shirt", "T-Shirt Oversize", "Shirt", "Blouse", "Hoodie", "Jacket", "Sweater", "Crop Top"];
const TOP_MATERIALS = ["Cotton", "Polyester", "Silk", "Linen", "Wool", "Denim", "Leather", "Knitted"];

const SETELAN_TYPES = ["One Set", "Suit", "Tracksuit", "Jumpsuit", "Dress", "Pajamas"];
const SETELAN_MATERIALS = ["Cotton", "Rayon", "Polyester", "Silk", "Linen", "Knitted", "Denim"];

// --- Helper Components ---

const SidebarItem = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
  <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
    <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} />
    <span className="font-medium text-sm">{label}</span>
  </Link>
);

const SectionHeader = ({ number, title, color }: { number: string, title: string, color: string }) => (
    <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-2">
        <span className={`flex items-center justify-center w-8 h-8 rounded-full ${color} text-white text-sm font-bold shadow-md`}>{number}</span>
        <h2 className="text-lg font-bold text-gray-200 uppercase tracking-wide">{title}</h2>
    </div>
);

const ModeButton = ({ mode, currentMode, setMode, label, sub, icon: Icon, colorClass }: { mode: GenerationMode, currentMode: GenerationMode, setMode: (m: GenerationMode) => void, label: string, sub: string, icon: any, colorClass: string }) => {
    const isActive = currentMode === mode;
    return (
        <button 
          onClick={() => setMode(mode)}
          className={`p-3 rounded-xl text-left transition-all duration-200 border flex flex-col justify-center items-center text-center h-28 relative overflow-hidden group ${isActive ? `bg-gray-800 ${colorClass} ring-2 ring-offset-1 ring-offset-gray-900 ring-opacity-60` : 'bg-gray-800 border-gray-700 hover:bg-gray-750 hover:border-gray-600'}`}
        >
          <div className={`p-2 rounded-full mb-2 bg-gray-700 group-hover:bg-gray-600 transition-colors ${isActive ? 'bg-opacity-20' : ''}`}>
              <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
          </div>
          <p className={`text-[10px] sm:text-xs font-bold leading-tight ${isActive ? 'text-white' : 'text-gray-300'}`}>{label}</p>
          <p className="text-[9px] text-gray-500 mt-1 line-clamp-2">{sub}</p>
          {isActive && <div className={`absolute bottom-0 left-0 w-full h-1 ${colorClass.replace('border-', 'bg-').replace('text-', 'bg-').split(' ')[0]}`}></div>}
        </button>
    );
};

// --- Sub-View Components ---

const ModeSelectionView = ({ pathname, generationMode, setGenerationMode, t }: { pathname: string, generationMode: GenerationMode, setGenerationMode: (m: GenerationMode) => void, t: any }) => {
    if (pathname === '/') {
        return (
           <section className="bg-gray-900 border border-gray-800 p-5 rounded-2xl shadow-sm mb-6 animate-fadeIn">
              <div className="mb-6">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-3 ml-1 tracking-widest">{t.topsCategoryLabel || "UGC General Categories"}</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                      <ModeButton mode="ugc_smart" currentMode={generationMode} setMode={setGenerationMode} label={t.modeSmart} sub={t.subSmart} icon={SparklesIcon} colorClass="border-purple-500 text-purple-400" />
                      <ModeButton mode="ugc_tryon" currentMode={generationMode} setMode={setGenerationMode} label={t.modeTryOn || "Try-On Sequence"} sub={t.subTryOn || "Front, Left, Right angles"} icon={SparklesIcon} colorClass="border-blue-500 text-blue-400" />
                      <ModeButton mode="ugc_fabric_touch" currentMode={generationMode} setMode={setGenerationMode} label={t.modeFabricTouch || "Fabric Touch Moment"} sub={t.subFabricTouch || "Natural material interaction"} icon={SparklesIcon} colorClass="border-pink-500 text-pink-400" />
                      <ModeButton mode="ugc_side_turn" currentMode={generationMode} setMode={setGenerationMode} label={t.modeSideTurn || "Side Turn Check"} sub={t.subSideTurn || "30° and 45° angles"} icon={SparklesIcon} colorClass="border-indigo-500 text-indigo-400" />
                      <ModeButton mode="ugc_mirror_check" currentMode={generationMode} setMode={setGenerationMode} label={t.modeMirrorCheck || "Mirror Check"} sub={t.subMirrorCheck || "No selfie reflection"} icon={SparklesIcon} colorClass="border-teal-500 text-teal-400" />
                      {/* Restored Tops specific modes */}
                      <ModeButton mode="ugc_neckline_check" currentMode={generationMode} setMode={setGenerationMode} label={t.modeNecklineCheck || "Collar Check"} sub={t.subNecklineCheck || "Neckline & focus"} icon={SparklesIcon} colorClass="border-cyan-500 text-cyan-400" />
                      <ModeButton mode="ugc_sleeve_movement" currentMode={generationMode} setMode={setGenerationMode} label={t.modeSleeveMovement || "Sleeve Motion"} sub={t.subSleeveMovement || "Length & movement"} icon={SparklesIcon} colorClass="border-emerald-500 text-emerald-400" />
                      <ModeButton mode="ugc_shoulder_fit" currentMode={generationMode} setMode={setGenerationMode} label={t.modeShoulderFit || "Shoulder Fit"} sub={t.subShoulderFit || "Top seam focus"} icon={SparklesIcon} colorClass="border-amber-500 text-amber-400" />
                      <ModeButton mode="ugc_layering_compatibility" currentMode={generationMode} setMode={setGenerationMode} label={t.modeLayering || "Layering Check"} sub={t.subLayering || "Compatibility open"} icon={SparklesIcon} colorClass="border-rose-500 text-rose-400" />
                      <ModeButton mode="ugc_comfort_hold" currentMode={generationMode} setMode={setGenerationMode} label={t.modeComfortHold || "Comfort Hold"} sub={t.subComfortHold || "Soft hands posture"} icon={SparklesIcon} colorClass="border-violet-500 text-violet-400" />
                  </div>
              </div>

              <div className="mb-6">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-3 ml-1 tracking-widest">{t.bottomsCategoryLabel || "UGC Bottoms Category"}</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                      <ModeButton mode="ugc_bottoms_fit" currentMode={generationMode} setMode={setGenerationMode} label={t.modeBottomsFit || "Bottoms Fit Check"} sub={t.subBottomsFit || "Waist & Leg analysis"} icon={SparklesIcon} colorClass="border-emerald-500 text-emerald-400" />
                      <ModeButton mode="ugc_sit_stand" currentMode={generationMode} setMode={setGenerationMode} label={t.modeSitStand || "Sit & Stand Check"} sub={t.subSitStand || "Comfort & mobility"} icon={SparklesIcon} colorClass="border-orange-500 text-orange-400" />
                      <ModeButton mode="ugc_bottoms_fabric" currentMode={generationMode} setMode={setGenerationMode} label={t.modeBottomsFabric || "Fabric & Edge View"} sub={t.subBottomsFabric || "Texture & stitching"} icon={SparklesIcon} colorClass="border-cyan-500 text-cyan-400" />
                      <ModeButton mode="ugc_side_profile_fall" currentMode={generationMode} setMode={setGenerationMode} label={t.modeSideProfileFall || "Side Fall Check"} sub={t.subSideProfileFall || "Side draping look"} icon={SparklesIcon} colorClass="border-blue-500 text-blue-400" />
                      <ModeButton mode="ugc_length_proportion" currentMode={generationMode} setMode={setGenerationMode} label={t.modeLengthProportion || "Length & Proportion"} sub={t.subLengthProportion || "Full body look"} icon={SparklesIcon} colorClass="border-violet-500 text-violet-400" />
                      {/* Restored Bottoms specific modes */}
                      <ModeButton mode="ugc_waist_hip_fit" currentMode={generationMode} setMode={setGenerationMode} label={t.modeWaistHip || "Waist & Hip Fit"} sub={t.subWaistHip || "Framing waist to knee"} icon={SparklesIcon} colorClass="border-pink-500 text-pink-400" />
                      <ModeButton mode="ugc_thigh_knee_space" currentMode={generationMode} setMode={setGenerationMode} label={t.modeThighKnee || "Thigh & Knee"} sub={t.subThighKnee || "Space & flexibility"} icon={SparklesIcon} colorClass="border-lime-500 text-lime-400" />
                      <ModeButton mode="ugc_back_seat_fit" currentMode={generationMode} setMode={setGenerationMode} label={t.modeBackSeat || "Back Seat Fit"} sub={t.subBackSeat || "Realistic back view"} icon={SparklesIcon} colorClass="border-indigo-500 text-indigo-400" />
                      <ModeButton mode="ugc_hem_cuff" currentMode={generationMode} setMode={setGenerationMode} label={t.modeHemCuff || "Hem & Cuff"} sub={t.subHemCuff || "Natural resting"} icon={SparklesIcon} colorClass="border-fuchsia-500 text-fuchsia-400" />
                      <ModeButton mode="ugc_daily_motion" currentMode={generationMode} setMode={setGenerationMode} label={t.modeDailyMotion || "Daily Motion"} sub={t.subDailyMotion || "Mid-step pause"} icon={SparklesIcon} colorClass="border-yellow-500 text-yellow-400" />
                  </div>
              </div>

              <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-3 ml-1 tracking-widest">{t.oneSetCategoryLabel || "UGC One Set Category"}</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                      <ModeButton mode="ugc_full_set_balance" currentMode={generationMode} setMode={setGenerationMode} label={t.modeFullSetBalance || "Full Set Balance"} sub={t.subFullSetBalance || "Total body harmony"} icon={SparklesIcon} colorClass="border-indigo-500 text-indigo-400" />
                      <ModeButton mode="ugc_top_bottom_transition" currentMode={generationMode} setMode={setGenerationMode} label={t.modeTopBottomTransition || "Transition Check"} sub={t.subTopBottomTransition || "Top meets bottom"} icon={SparklesIcon} colorClass="border-violet-500 text-violet-400" />
                      <ModeButton mode="ugc_movement_harmony" currentMode={generationMode} setMode={setGenerationMode} label={t.modeMovementHarmony || "Movement Harmony"} sub={t.subMovementHarmony || "Coordinated flow"} icon={SparklesIcon} colorClass="border-fuchsia-500 text-fuchsia-400" />
                      <ModeButton mode="ugc_casual_styling" currentMode={generationMode} setMode={setGenerationMode} label={t.modeCasualStyling || "Casual Set Styling"} sub={t.subCasualStyling || "Authentic daily look"} icon={SparklesIcon} colorClass="border-sky-500 text-sky-400" />
                      <ModeButton mode="ugc_mirror_set_review" currentMode={generationMode} setMode={setGenerationMode} label={t.modeMirrorSetReview || "Mirror Full Review"} sub={t.subMirrorSetReview || "Selfie set check"} icon={SparklesIcon} colorClass="border-rose-500 text-rose-400" />
                  </div>
              </div>
          </section>
        );
    } else if (pathname === '/tools') {
        return (
          <section className="bg-gray-900 border border-gray-800 p-5 rounded-2xl shadow-sm mb-6 animate-fadeIn">
              <div className="mb-0">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 ml-1">Utility Tools</label>
                  <div className="grid grid-cols-1">
                       <ModeButton mode="background_replace" currentMode={generationMode} setMode={setGenerationMode} label={t.modeBackground} sub={t.subBg} icon={SparklesIcon} colorClass="border-yellow-500 text-yellow-400" />
                  </div>
              </div>
          </section>
        );
    }
    return null;
}

const FootwearSection = ({
    footwearGender,
    setFootwearGender,
    selectedFootwear,
    handleFootwearChange,
    customFootwear,
    setCustomFootwear,
    t
}: any) => {
    const options = FOOTWEAR_OPTIONS[footwearGender as 'men' | 'women'] || [];

    return (
        <div className="mt-4 bg-gray-800/50 p-3 rounded-xl border border-gray-700/50">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">{t.footwearTitle}</h3>
            <div className="mb-3">
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">{t.genderLabel}</label>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => setFootwearGender('women')}
                        className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-colors ${footwearGender === 'women' ? 'bg-pink-600 text-white shadow-md' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
                    >
                        {t.genderWomen}
                    </button>
                    <button
                        onClick={() => setFootwearGender('men')}
                        className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-colors ${footwearGender === 'men' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
                    >
                        {t.genderMen}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto custom-scrollbar border border-gray-800 rounded-lg p-1 mb-3">
                <label className="flex items-center p-2 hover:bg-gray-800 rounded cursor-pointer group">
                    <input
                        type="radio"
                        name="footwear_item"
                        checked={selectedFootwear === ''}
                        onChange={() => handleFootwearChange('')}
                        className="text-pink-500 focus:ring-pink-500 bg-gray-700 border-gray-600"
                    />
                    <span className="ml-2 text-xs text-gray-300 group-hover:text-white">{t.noneOption}</span>
                </label>
                {options.map((shoe) => (
                    <label key={shoe} className="flex items-center p-2 hover:bg-gray-800 rounded cursor-pointer group">
                        <input
                            type="radio"
                            name="footwear_item"
                            checked={selectedFootwear === shoe}
                            onChange={() => handleFootwearChange(shoe)}
                            className="text-pink-500 focus:ring-pink-500 bg-gray-700 border-gray-600"
                        />
                        <span className="ml-2 text-xs text-gray-300 group-hover:text-white">{shoe}</span>
                    </label>
                ))}
                <label className="flex items-center p-2 hover:bg-gray-800 rounded cursor-pointer group">
                    <input
                        type="radio"
                        name="footwear_item"
                        checked={selectedFootwear === 'Other'}
                        onChange={() => handleFootwearChange('Other')}
                        className="text-pink-500 focus:ring-pink-500 bg-gray-700 border-gray-600"
                    />
                    <span className="ml-2 text-xs text-gray-300 group-hover:text-white">{t.otherOption}</span>
                </label>
            </div>

            {selectedFootwear === 'Other' && (
                <div className="mt-2">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">{t.specifyPlaceholder}</label>
                    <input
                        type="text"
                        placeholder="e.g. Vintage Leather Boots"
                        value={customFootwear}
                        onChange={(e) => setCustomFootwear(e.target.value)}
                        className="w-full bg-gray-950 border border-gray-700 text-xs rounded p-2 text-white placeholder-gray-500 focus:ring-1 focus:ring-purple-500"
                    />
                </div>
            )}
        </div>
    );
};

// --- Main App Content ---

const AppContent: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('gemini_api_key') || '');
  const [prompt, setPrompt] = useState<string>('');
  const [language, setLanguage] = useState<'en' | 'id'>('en');
  const t = translations[language] || translations['en'];
  const [baseModelImage, setBaseModelImage] = useState<ImageFile | null>(null);
  const [pantsImage, setPantsImage] = useState<ImageFile | null>(null);
  const [topImage, setTopImage] = useState<ImageFile | null>(null);
  const [setelanImage, setSetelanImage] = useState<ImageFile | null>(null);
  const [generatedResults, setGeneratedResults] = useState<GeneratedResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const [generationMode, setGenerationMode] = useState<GenerationMode>('ugc_smart');
  
  const [quality, setQuality] = useState<QualityLevel>('standard');
  const [selectedCameraPreset, setSelectedCameraPreset] = useState<string>(CAMERA_PRESETS[0].id);
  const [selectedCinematicAngles, setSelectedCinematicAngles] = useState<string[]>([]);
  const [selectedBgCategory, setSelectedBgCategory] = useState<string>(BACKGROUND_CATEGORIES[0].id);
  const [selectedBgPreset, setSelectedBgPreset] = useState<string>('');
  const [customBgPrompt, setCustomBgPrompt] = useState<string>('');
  const [enableBackground, setEnableBackground] = useState<boolean>(false);
  const [poseCategory, setPoseCategory] = useState<PoseCategory>('normal');
  const [selectedPoses, setSelectedPoses] = useState<string[]>([]);
  const [selectedExpressions, setSelectedExpressions] = useState<string[]>([]);
  
  const [pantType, setPantType] = useState<string>(PANT_TYPES[0]);
  const [customPantType, setCustomPantType] = useState<string>('');
  const [material, setMaterial] = useState<string>(MATERIALS[0]);
  const [customMaterial, setCustomMaterial] = useState<string>('');

  const [topType, setTopType] = useState<string>(TOP_TYPES[0]);
  const [customTopType, setCustomTopType] = useState<string>('');
  const [topMaterial, setTopMaterial] = useState<string>(TOP_MATERIALS[0]);
  const [customTopMaterial, setCustomTopMaterial] = useState<string>('');

  const [setelanType, setSetelanType] = useState<string>(SETELAN_TYPES[0]);
  const [customSetelanType, setCustomSetelanType] = useState<string>('');
  const [setelanMaterial, setSetelanMaterial] = useState<string>(SETELAN_MATERIALS[0]);
  const [customSetelanMaterial, setCustomSetelanMaterial] = useState<string>('');

  const [footwearGender, setFootwearGender] = useState<'men' | 'women'>('women');
  const [selectedFootwear, setSelectedFootwear] = useState<string>('');
  const [customFootwear, setCustomFootwear] = useState<string>('');
  
  const location = useLocation();
  const navigate = useNavigate();

  // --- Effects ---

  useEffect(() => {
    localStorage.setItem('gemini_api_key', apiKey);
  }, [apiKey]);

  useEffect(() => {
    const path = location.pathname;
    // Fix: Missing modes in whitelist caused reset. Added ALL available modes.
    const isHomeUgc = path === '/' && [
        'ugc_smart', 'ugc_tryon', 'ugc_fabric_touch', 'ugc_side_turn', 'ugc_mirror_check', 
        'ugc_neckline_check', 'ugc_sleeve_movement', 'ugc_shoulder_fit', 'ugc_layering_compatibility', 'ugc_comfort_hold',
        'ugc_waist_hip_fit', 'ugc_thigh_knee_space', 'ugc_back_seat_fit', 'ugc_hem_cuff', 'ugc_daily_motion',
        'ugc_full_set_balance', 'ugc_top_bottom_transition', 'ugc_movement_harmony', 'ugc_casual_styling', 'ugc_mirror_set_review',
        'ugc_bottoms_fit', 'ugc_sit_stand', 'ugc_bottoms_fabric', 'ugc_side_profile_fall', 'ugc_length_proportion'
    ].includes(generationMode);

    if (path === '/' && !isHomeUgc) {
        setGenerationMode('ugc_smart');
    } else if (path === '/angles' && generationMode !== 'ugc_angles_cinematic') {
        setGenerationMode('ugc_angles_cinematic');
    } else if (path === '/tools' && generationMode !== 'background_replace') {
        setGenerationMode('background_replace');
    }
  }, [location.pathname, generationMode]);

  // --- Handlers ---

  const handleBgPresetChange = (presetId: string) => {
      setSelectedBgPreset(presetId);
      const category = BACKGROUND_CATEGORIES.find(c => c.id === selectedBgCategory);
      const preset = category?.presets.find(p => p.id === presetId);
      if (preset) {
          setCustomBgPrompt(preset.prompt || '');
          setEnableBackground(true);
      }
  };
  
  const handleFootwearChange = (itemId: string) => setSelectedFootwear(itemId);

  const handleCopyPrompt = (id: string, text: string) => {
      navigator.clipboard.writeText(text).then(() => {
          setCopiedId(id);
          setTimeout(() => setCopiedId(null), 2000);
      });
  };

  const handleGenerateUGC = useCallback(async () => {
    if (!baseModelImage) { setError(t.errorMissingBase); return; }
    
    // Manual API key check
    if (!apiKey) {
        setError(t.errorMissingKey);
        return;
    }

    const effectivePantType = pantType === 'Other' ? customPantType : pantType;
    const effectivePantMaterial = material === 'Other' ? customMaterial : material;
    const effectiveTopType = topType === 'Other' ? customTopType : topType;
    const effectiveTopMaterial = topMaterial === 'Other' ? customTopMaterial : topMaterial;
    const effectiveSetelanType = setelanType === 'Other' ? customSetelanType : setelanType;
    const effectiveSetelanMaterial = setelanMaterial === 'Other' ? customSetelanMaterial : setelanMaterial;

    const needsSetelanImage = ['ugc_full_set_balance', 'ugc_top_bottom_transition', 'ugc_movement_harmony', 'ugc_casual_styling', 'ugc_mirror_set_review'].includes(generationMode);

    if (needsSetelanImage && !setelanImage) { setError(t.errorMissingSetelan); return; }

    const smartModes = ['ugc_smart', 'ugc_tryon', 'ugc_fabric_touch', 'ugc_side_turn', 'ugc_mirror_check', 
        'ugc_neckline_check', 'ugc_sleeve_movement', 'ugc_shoulder_fit', 'ugc_layering_compatibility', 'ugc_comfort_hold',
        'ugc_waist_hip_fit', 'ugc_thigh_knee_space', 'ugc_back_seat_fit', 'ugc_hem_cuff', 'ugc_daily_motion',
        'ugc_bottoms_fit', 'ugc_sit_stand', 'ugc_bottoms_fabric', 'ugc_side_profile_fall', 'ugc_length_proportion'];

    if (smartModes.includes(generationMode)) {
        if (!setelanImage && !topImage && !pantsImage) {
            setError(t.errorMissingProductSmart);
            return;
        }
    }

    setError(null);
    setIsLoading(true);
    
    try {
      let images: string[] = [];
      const footwearToUse = selectedFootwear === 'Other' ? customFootwear.trim() : (selectedFootwear || undefined);
      const keyToUse = apiKey; // Use manual API Key

      if (generationMode === 'ugc_tryon') {
          images = await generateUgcTryOnImages(baseModelImage, pantsImage, topImage, setelanImage, quality, effectivePantType, effectivePantMaterial, effectiveTopType, effectiveTopMaterial, effectiveSetelanType, effectiveSetelanMaterial, footwearToUse, prompt, keyToUse);
      } else if (generationMode === 'ugc_fabric_touch') {
          images = await generateUgcFabricTouchImages(baseModelImage, pantsImage, topImage, setelanImage, quality, effectivePantType, effectivePantMaterial, effectiveTopType, effectiveTopMaterial, effectiveSetelanType, effectiveSetelanMaterial, footwearToUse, prompt, keyToUse);
      } else if (generationMode === 'ugc_side_turn') {
          images = await generateUgcSideTurnImages(baseModelImage, pantsImage, topImage, setelanImage, quality, effectivePantType, effectivePantMaterial, effectiveTopType, effectiveTopMaterial, effectiveSetelanType, effectiveSetelanMaterial, footwearToUse, prompt, keyToUse);
      } else if (generationMode === 'ugc_mirror_check') {
          images = await generateUgcMirrorCheckImages(baseModelImage, pantsImage, topImage, setelanImage, quality, effectivePantType, effectivePantMaterial, effectiveTopType, effectiveTopMaterial, effectiveSetelanType, effectiveSetelanMaterial, footwearToUse, prompt, keyToUse);
      } else if (generationMode === 'ugc_full_set_balance') {
          images = await generateUgcFullSetBalance(baseModelImage, setelanImage!, effectiveSetelanType, effectiveSetelanMaterial, quality, footwearToUse, prompt, keyToUse);
      } else if (generationMode === 'ugc_top_bottom_transition') {
          images = await generateUgcTopBottomTransition(baseModelImage, setelanImage!, effectiveSetelanType, effectiveSetelanMaterial, quality, footwearToUse, prompt, keyToUse);
      } else if (generationMode === 'ugc_movement_harmony') {
          images = await generateUgcMovementHarmony(baseModelImage, setelanImage!, effectiveSetelanType, effectiveSetelanMaterial, quality, footwearToUse, prompt, keyToUse);
      } else if (generationMode === 'ugc_casual_styling') {
          images = await generateUgcCasualStyling(baseModelImage, setelanImage!, effectiveSetelanType, effectiveSetelanMaterial, quality, footwearToUse, prompt, keyToUse);
      } else if (generationMode === 'ugc_mirror_set_review') {
          images = await generateUgcMirrorSetReview(baseModelImage, setelanImage!, effectiveSetelanType, effectiveSetelanMaterial, quality, footwearToUse, prompt, keyToUse);
      } else if (generationMode === 'ugc_bottoms_fit') {
          images = await generateUgcBottomsFitCheckImages(baseModelImage, pantsImage, topImage, setelanImage, quality, effectivePantType, effectivePantMaterial, effectiveTopType, effectiveTopMaterial, effectiveSetelanType, effectiveSetelanMaterial, footwearToUse, prompt, keyToUse);
      } else if (generationMode === 'ugc_sit_stand') {
          images = await generateUgcSitStandImages(baseModelImage, pantsImage, topImage, setelanImage, quality, effectivePantType, effectivePantMaterial, effectiveTopType, effectiveTopMaterial, effectiveSetelanType, effectiveSetelanMaterial, footwearToUse, prompt, keyToUse);
      } else if (generationMode === 'ugc_bottoms_fabric') {
          images = await generateUgcBottomsFabricImages(baseModelImage, pantsImage, topImage, setelanImage, quality, effectivePantType, effectivePantMaterial, effectiveTopType, effectiveTopMaterial, effectiveSetelanType, effectiveSetelanMaterial, footwearToUse, prompt, keyToUse);
      } else if (generationMode === 'ugc_side_profile_fall') {
          images = await generateUgcSideProfileFallImages(baseModelImage, pantsImage, topImage, setelanImage, quality, effectivePantType, effectivePantMaterial, effectiveTopType, effectiveTopMaterial, effectiveSetelanType, effectiveSetelanMaterial, footwearToUse, prompt, keyToUse);
      } else if (generationMode === 'ugc_length_proportion') {
          images = await generateUgcLengthProportionImages(baseModelImage, pantsImage, topImage, setelanImage, quality, effectivePantType, effectivePantMaterial, effectiveTopType, effectiveTopMaterial, effectiveSetelanType, effectiveSetelanMaterial, footwearToUse, prompt, keyToUse);
      } else if (generationMode === 'ugc_neckline_check') {
          images = await generateUgcNecklineCheck(baseModelImage, topImage!, effectiveTopType, effectiveTopMaterial, pantsImage, effectivePantType, effectivePantMaterial, quality, footwearToUse, prompt, keyToUse);
      } else if (generationMode === 'ugc_sleeve_movement') {
          images = await generateUgcSleeveMovement(baseModelImage, topImage!, effectiveTopType, effectiveTopMaterial, pantsImage, effectivePantType, effectivePantMaterial, quality, footwearToUse, prompt, keyToUse);
      } else if (generationMode === 'ugc_shoulder_fit') {
          images = await generateUgcShoulderFit(baseModelImage, topImage!, effectiveTopType, effectiveTopMaterial, pantsImage, effectivePantType, effectivePantMaterial, quality, footwearToUse, prompt, keyToUse);
      } else if (generationMode === 'ugc_layering_compatibility') {
          images = await generateUgcLayeringCompatibility(baseModelImage, topImage!, effectiveTopType, effectiveTopMaterial, pantsImage, effectivePantType, effectivePantMaterial, quality, footwearToUse, prompt, keyToUse);
      } else if (generationMode === 'ugc_comfort_hold') {
          images = await generateUgcComfortHold(baseModelImage, topImage!, effectiveTopType, effectiveTopMaterial, pantsImage, effectivePantType, effectivePantMaterial, quality, footwearToUse, prompt, keyToUse);
      } else if (generationMode === 'ugc_waist_hip_fit') {
          images = await generateUgcWaistHipFitCheck(baseModelImage, pantsImage!, effectivePantType, effectivePantMaterial, topImage, effectiveTopType, effectiveTopMaterial, quality, footwearToUse, prompt, keyToUse);
      } else if (generationMode === 'ugc_thigh_knee_space') {
          images = await generateUgcThighKneeSpaceCheck(baseModelImage, pantsImage!, effectivePantType, effectivePantMaterial, topImage, effectiveTopType, effectiveTopMaterial, quality, footwearToUse, prompt, keyToUse);
      } else if (generationMode === 'ugc_back_seat_fit') {
          images = await generateUgcBackSeatFitCheck(baseModelImage, pantsImage!, effectivePantType, effectivePantMaterial, topImage, effectiveTopType, effectiveTopMaterial, quality, footwearToUse, prompt, keyToUse);
      } else if (generationMode === 'ugc_hem_cuff') {
          images = await generateUgcHemCuffInteraction(baseModelImage, pantsImage!, effectivePantType, effectivePantMaterial, topImage, effectiveTopType, effectiveTopMaterial, quality, footwearToUse, prompt, keyToUse);
      } else if (generationMode === 'ugc_daily_motion') {
          images = await generateUgcDailyMotionPause(baseModelImage, pantsImage!, effectivePantType, effectivePantMaterial, topImage, effectiveTopType, effectiveTopMaterial, quality, footwearToUse, prompt, keyToUse);
      } else if (generationMode === 'ugc_smart') {
          if (setelanImage) {
              images = await generateUgcSetelanImages(baseModelImage, setelanImage, effectiveSetelanType, effectiveSetelanMaterial, quality, undefined, [], '', footwearToUse, undefined, undefined, undefined, prompt, keyToUse);
          } else if (topImage) {
              images = await generateUgcTopImages(baseModelImage, topImage, effectiveTopType, effectiveTopMaterial, pantsImage, effectivePantType, effectivePantMaterial, false, quality, [], undefined, [], '', footwearToUse, undefined, undefined, undefined, prompt, keyToUse);
          } else if (pantsImage) {
              images = await generateUgcPantsImages(baseModelImage, pantsImage, effectivePantType, effectivePantMaterial, topImage, effectiveTopType, effectiveTopMaterial, false, quality, [], undefined, [], '', footwearToUse, undefined, undefined, undefined, prompt, keyToUse);
          }
      }
      
      const modeFilename = generationMode.replace('ugc_', '').replace(/_/g, '-');
      const newResults: GeneratedResult[] = images.map((img, idx) => ({
          id: generateId(),
          image: img,
          videoPrompt: null,
          loadingPrompt: true,
          timestamp: Date.now(),
          filename: `${modeFilename}-${idx + 1}`
      }));

      setGeneratedResults(prev => [...newResults, ...prev]);
      newResults.forEach(async (result) => {
          try {
              const videoPrompt = await generateAutoVideoPrompt(`Realistic video showcasing this outfit styling`, keyToUse);
              setGeneratedResults(current => current.map(item => item.id === result.id ? { ...item, videoPrompt, loadingPrompt: false } : item));
          } catch (e) {
              setGeneratedResults(current => current.map(item => item.id === result.id ? { ...item, videoPrompt: "N/A", loadingPrompt: false } : item));
          }
      });

    } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [baseModelImage, pantsImage, topImage, setelanImage, pantType, customPantType, material, customMaterial, topType, customTopType, topMaterial, customTopMaterial, setelanType, customSetelanType, setelanMaterial, customSetelanMaterial, generationMode, quality, selectedFootwear, customFootwear, t, prompt, location.pathname, apiKey]);

  const getEstimatedImageCount = () => {
      if (['ugc_tryon', 'ugc_full_set_balance', 'ugc_top_bottom_transition', 'ugc_movement_harmony', 'ugc_casual_styling', 'ugc_mirror_set_review', 'ugc_bottoms_fit', 'ugc_sit_stand', 'ugc_neckline_check', 'ugc_sleeve_movement', 'ugc_shoulder_fit', 'ugc_layering_compatibility', 'ugc_comfort_hold', 'ugc_waist_hip_fit', 'ugc_thigh_knee_space', 'ugc_back_seat_fit', 'ugc_hem_cuff', 'ugc_daily_motion'].includes(generationMode)) return { total: 3, details: '3 variations' };
      if (['ugc_fabric_touch', 'ugc_side_turn', 'ugc_mirror_check', 'ugc_bottoms_fabric', 'ugc_side_profile_fall', 'ugc_length_proportion'].includes(generationMode)) return { total: 2, details: '2 variations' };
      return { total: 1, details: '1 variation' };
  };

  const isGenerateDisabled = isLoading;
  const getButtonLabel = () => {
      if (generationMode === 'ugc_smart') return t.generateSmart;
      if (generationMode === 'ugc_tryon') return t.generateTryOn;
      if (generationMode === 'ugc_fabric_touch') return t.generateFabricTouch;
      if (generationMode === 'ugc_side_turn') return t.generateSideTurn;
      if (generationMode === 'ugc_mirror_check') return t.generateMirrorCheck;
      if (generationMode === 'ugc_full_set_balance') return t.generateFullSetBalance;
      if (generationMode === 'ugc_top_bottom_transition') return t.generateTopBottomTransition;
      if (generationMode === 'ugc_movement_harmony') return t.generateMovementHarmony;
      if (generationMode === 'ugc_casual_styling') return t.generateCasualStyling;
      if (generationMode === 'ugc_mirror_set_review') return t.generateMirrorSetReview;
      if (generationMode === 'ugc_bottoms_fit') return t.generateBottomsFit;
      if (generationMode === 'ugc_sit_stand') return t.generateSitStand;
      if (generationMode === 'ugc_bottoms_fabric') return t.generateBottomsFabric;
      if (generationMode === 'ugc_side_profile_fall') return t.generateSideProfileFall;
      if (generationMode === 'ugc_length_proportion') return t.generateLengthProportion;
      // Labels for newly restored modes
      if (generationMode === 'ugc_neckline_check') return t.generateNecklineCheck;
      if (generationMode === 'ugc_sleeve_movement') return t.generateSleeveMovement;
      if (generationMode === 'ugc_shoulder_fit') return t.generateShoulderFit;
      if (generationMode === 'ugc_layering_compatibility') return t.generateLayering;
      if (generationMode === 'ugc_comfort_hold') return t.generateComfortHold;
      if (generationMode === 'ugc_waist_hip_fit') return t.generateWaistHip;
      if (generationMode === 'ugc_thigh_knee_space') return t.generateThighKnee;
      if (generationMode === 'ugc_back_seat_fit') return t.generateBackSeat;
      if (generationMode === 'ugc_hem_cuff') return t.generateHemCuff;
      if (generationMode === 'ugc_daily_motion') return t.generateDailyMotion;
      return t.generateBtn;
  }
  
  const estimatedInfo = getEstimatedImageCount();

  return (
    <div className="flex h-screen bg-gray-950 text-white font-sans overflow-hidden">
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col z-20 shadow-xl">
        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg"><SparklesIcon className="w-5 h-5 text-white mr-0" /></div>
             <span className="font-bold text-lg tracking-tight">UGC Studio</span>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
            <SidebarItem to="/" icon={() => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>} label="UGC Concepts" active={location.pathname === '/'} />
            <SidebarItem to="/tools" icon={() => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>} label="Tools" active={location.pathname === '/tools'} />
        </nav>
        <div className="p-4 border-t border-gray-800">
            <div className="mb-4">
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 ml-1">API Key</label>
                <input 
                    type="password"
                    placeholder={t.apiKeyPlaceholder}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-xs rounded p-2 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="block text-[9px] text-gray-500 mt-2 hover:underline">Get API Key from Google AI Studio</a>
            </div>
            <div className="flex justify-between items-center">
                 <button onClick={() => setLanguage(prev => prev === 'en' ? 'id' : 'en')} className="text-xs font-bold text-gray-500 hover:text-white transition-colors">{language === 'en' ? '🇮🇩 Switch to ID' : '🇺🇸 Switch to EN'}</button>
            </div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-gray-950 relative custom-scrollbar">
         <header className="sticky top-0 z-30 bg-gray-950/80 backdrop-blur-md border-b border-gray-800 px-8 py-4 flex justify-between items-center">
             <div>
                 <h1 className="text-xl font-bold text-white">UGC Studio</h1>
                 <p className="text-xs text-gray-400 mt-1">Generate high-quality product visuals.</p>
             </div>
         </header>
         <div className="p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
             <div className="lg:col-span-5 flex flex-col gap-6">
                 <SectionHeader number="1" title={t.selectModeLabel} color="bg-purple-900" />
                 <ModeSelectionView pathname={location.pathname} generationMode={generationMode} setGenerationMode={setGenerationMode} t={t} />
                 
                 <SectionHeader number="2" title={`${t.baseModelTitle} & Assets`} color="bg-blue-900" />
                 <section className="bg-gray-900 border border-gray-800 p-5 rounded-2xl shadow-sm mb-6">
                    <ImageUploader id="base-model" title={t.baseModelTitle} onImageUpload={setBaseModelImage} clickText={t.uploadClick} formatText={t.uploadFormats} />
                    <div className="mt-6 space-y-4">
                        <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                            <h3 className="text-xs font-bold text-indigo-400 mb-3 uppercase">{t.setelanTitle}</h3>
                            <ImageUploader id="product-setelan" title={t.productSetelanTitle} onImageUpload={setSetelanImage} clickText={t.uploadClick} />
                            <div className="mt-3 grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] text-gray-400 uppercase font-semibold">{t.typeLabel}</label>
                                    <select value={setelanType} onChange={(e) => setSetelanType(e.target.value)} className="w-full bg-gray-800 border-gray-600 text-xs rounded p-2 mt-1">
                                        {SETELAN_TYPES.map(val => <option key={val} value={val}>{val}</option>)}
                                        <option value="Other">{t.otherOption}</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-400 uppercase font-semibold">{t.materialLabel}</label>
                                    <select value={setelanMaterial} onChange={(e) => setSetelanMaterial(e.target.value)} className="w-full bg-gray-800 border-gray-600 text-xs rounded p-2 mt-1">
                                        {SETELAN_MATERIALS.map(val => <option key={val} value={val}>{val}</option>)}
                                        <option value="Other">{t.otherOption}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                 </section>

                 <SectionHeader number="3" title="Studio Settings" color="bg-gray-700" />
                 <section className="bg-gray-900 border border-gray-800 p-5 rounded-2xl shadow-sm mb-20">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">{t.outputQualityLabel}</label>
                            <select value={quality} onChange={(e) => setQuality(e.target.value as QualityLevel)} className="w-full bg-gray-800 border-gray-600 text-xs rounded p-2 text-gray-200">
                                <option value="standard">Standard</option>
                                <option value="hd">HD (2K)</option>
                                <option value="4k">4K</option>
                            </select>
                         </div>
                     </div>
                     <FootwearSection
                         footwearGender={footwearGender}
                         setFootwearGender={setFootwearGender}
                         selectedFootwear={selectedFootwear}
                         handleFootwearChange={handleFootwearChange}
                         customFootwear={customFootwear}
                         setCustomFootwear={setCustomFootwear}
                         t={t}
                     />
                     <div className="mt-4">
                         <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">{t.customPromptLabel}</label>
                         <textarea className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-sm text-white focus:ring-2 focus:ring-purple-500 font-mono" rows={3} placeholder={t.customPromptPlaceholder} value={prompt} onChange={(e) => setPrompt(e.target.value)} />
                     </div>
                 </section>

                 <div className="fixed bottom-0 right-0 w-full lg:w-[calc(100%-16rem)] p-4 bg-gray-950/90 backdrop-blur-lg border-t border-gray-800 z-40 flex justify-center">
                    <div className="w-full max-w-lg">
                        <div className="flex justify-between items-center mb-2 px-1">
                            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Estimated Output</span>
                            <span className="text-xs font-bold text-white bg-gray-800 px-2 py-1 rounded-md border border-gray-700">
                                {estimatedInfo.total} Image{estimatedInfo.total > 1 ? 's' : ''}
                            </span>
                        </div>
                        <button onClick={handleGenerateUGC} disabled={isGenerateDisabled} className={`w-full py-4 px-6 rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 ${isGenerateDisabled ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white'}`}>
                            {isLoading ? (<><Spinner /><span>{t.loading}</span></>) : (<><SparklesIcon className="w-6 h-6" /><span>{getButtonLabel()}</span></>)}
                        </button>
                        {error && <div className="mt-2 p-2 bg-red-900/50 border border-red-700/50 rounded-lg text-red-200 text-xs text-center">{error}</div>}
                    </div>
                 </div>
             </div>
             <div className="lg:col-span-7 space-y-6">
                <div className="sticky top-24">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2"><span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-900 text-indigo-200 text-xs font-bold">R</span><h2 className="text-sm font-bold text-gray-200 uppercase tracking-wide">Generated Results</h2></div>
                    </div>
                    {generatedResults.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
                            {generatedResults.map((result, index) => (
                                <div key={result.id} className="group relative bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-gray-700 flex flex-col">
                                    <div className="aspect-[9/16] relative w-full overflow-hidden">
                                        <img src={`data:image/png;base64,${result.image}`} alt={`Generated ${index + 1}`} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><a href={`data:image/png;base64,${result.image}`} download={`${result.filename}.png`} className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold text-sm">Download</a></div>
                                    </div>
                                    <div className="p-3 border-t border-gray-700 bg-gray-900/50">
                                        <div className="flex items-center justify-between mb-1"><span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">{t.videoPromptLabel}</span></div>
                                        <div className="relative">{result.loadingPrompt ? <div className="flex items-center gap-2 text-[10px] text-gray-500 italic py-1"><Spinner />{t.videoPromptLoading}</div> : (<p className="text-[10px] text-gray-300 font-mono leading-relaxed bg-black/20 p-2 rounded">{result.videoPrompt}</p>)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="aspect-[3/4] rounded-3xl border-2 border-dashed border-gray-800 bg-gray-900/50 flex flex-col items-center justify-center text-center p-8"><SparklesIcon className="w-10 h-10 text-gray-600 mb-4" /><h3 className="text-lg font-bold text-gray-300 mb-2">{t.emptyStateTitle}</h3><p className="text-gray-500 max-w-xs">{t.emptyStateSub}</p></div>
                    )}
                </div>
             </div>
         </div>
      </main>
    </div>
  );
};

const App: React.FC = () => (
    <HashRouter>
      <AppContent />
    </HashRouter>
);

export default App;