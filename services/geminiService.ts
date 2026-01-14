
import { GoogleGenAI } from "@google/genai";
import { ImageFile } from "../types";

export type QualityLevel = 'standard' | 'hd' | '4k';

// --- Shared Constants ---
export const TOP_CAMERA_ANGLES = [
    { id: 'top_front_full', label: 'Front Full Upper-Body' },
    { id: 'top_front_medium', label: 'Front Medium Chest-Up' },
    { id: 'top_front_collar', label: 'Front Close-Up Collar' },
    { id: 'top_front_texture', label: 'Front Fabric Texture Close-Up' },
    { id: 'top_front_logo', label: 'Front Logo/Print Detail' },
    { id: 'top_side_upper', label: 'Side Upper-Body' },
    { id: 'top_side_sleeve', label: 'Side Sleeve Detail' },
    { id: 'top_side_chest', label: 'Side Chest Texture' },
    { id: 'top_45_front', label: '45° Front-Side Upper Body' },
    { id: 'top_45_back', label: '45° Back-Side Upper Body' },
    { id: 'top_back_full', label: 'Back Full Upper-Body' },
    { id: 'top_back_collar', label: 'Back Collar & Neckline Close-Up' },
    { id: 'top_shoulder_seams', label: 'Shoulder Seams Close-Up' },
    { id: 'top_sleeve_cuff', label: 'Sleeve Cuff Close-Up' },
    { id: 'top_hemline', label: 'Hemline Close-Up' },
    { id: 'top_chest_pocket', label: 'Chest Pocket Close-Up' },
    { id: 'top_wrinkle', label: 'Front Wrinkle Behavior' },
    { id: 'top_full_body_focus', label: 'Full Body (Focus on Top)' },
    { id: 'top_top_down', label: 'Top-Down Shoulder Angle' },
    { id: 'top_idle_micro', label: 'Idle Micro-Movement (No Pose)' }
];

export const PANTS_CAMERA_ANGLES = [
    { id: 'pants_front_full', label: 'Front Full Lower-Body' },
    { id: 'pants_front_medium', label: 'Front Medium Waist-Down' },
    { id: 'pants_front_waistband', label: 'Front Close-Up Waistband' },
    { id: 'pants_front_texture', label: 'Front Fabric Texture Close-Up' },
    { id: 'pants_front_pocket', label: 'Front Pocket Detail' },
    { id: 'pants_side_full', label: 'Side Full Lower-Body' },
    { id: 'pants_side_pocket_stitch', label: 'Side Pocket & Stitching Close-Up' },
    { id: 'pants_side_thigh', label: 'Side Thigh Texture Close-Up' },
    { id: 'pants_45_front_side', label: '45° Front-Side Lower Body' },
    { id: 'pants_45_back_side', label: '45° Back-Side Lower Body' },
    { id: 'pants_back_full', label: 'Back Full Lower-Body' },
    { id: 'pants_back_pocket', label: 'Back Pocket Detail Close-Up' },
    { id: 'pants_back_waistband', label: 'Back Waistband Close-Up' },
    { id: 'pants_low_angle', label: 'Low-Angle Upward Shot' },
    { id: 'pants_top_down', label: 'Top-Down Waist Area' },
    { id: 'pants_crotch', label: 'Crotch & Inseam Close-Up' },
    { id: 'pants_knee', label: 'Knee Area Close-Up' },
    { id: 'pants_hem', label: 'Bottom Hem Close-Up' },
    { id: 'pants_full_body_focus', label: 'Full Body (Focus Locked on Pants)' },
    { id: 'pants_walking_idle', label: 'Walking Idle (No Pose)' }
];

export const CINEMATIC_CAMERA_ANGLES = [
    { id: 'cine_high_angle', label: 'High Angle Shot' },
    { id: 'cine_low_angle', label: 'Low Angle Shot' },
    { id: 'cine_eye_level', label: 'Eye-Level Shot' },
    { id: 'cine_ots', label: 'Over-the-Shoulder (OTS) Shot' },
    { id: 'cine_dutch', label: 'Dutch Angle' },
    { id: 'cine_close_up', label: 'Close-Up Shot' },
    { id: 'cine_extreme_macro', label: 'Extreme Close-Up' },
    { id: 'cine_wide', label: 'Wide Shot' },
    { id: 'cine_full_body', label: 'Full Body Shot' },
    { id: 'cine_medium', label: 'Medium Shot' },
    { id: 'cine_cowboy', label: 'Cowboy Shot' },
    { id: 'cine_top_down', label: 'Top-Down Shot' },
    { id: 'cine_bottom_up', label: 'Bottom-Up Shot (Ultra Low)' },
    { id: 'cine_profile', label: 'Profile Shot' },
    { id: 'cine_quarter', label: 'Quarter Angle Shot (45°)' },
    { id: 'cine_back', label: 'Back Shot' },
    { id: 'cine_silhouette', label: 'Silhouette Shot' },
    { id: 'cine_pov', label: 'POV Shot' },
    { id: 'cine_telephoto', label: 'Telephoto Compression Shot' },
    { id: 'cine_parallax', label: 'Parallax Side Angle' }
];

export const MODEL_POSES = [
    { id: 'normal_stand', prompt: 'standing naturally in a relaxed posture' },
    { id: 'normal_hands_pockets', prompt: 'standing with both hands in pockets' },
    { id: 'normal_one_hand_pocket', prompt: 'standing with one hand in pocket' },
    { id: 'normal_arms_crossed', prompt: 'standing with arms crossed over chest' },
    { id: 'normal_adjusting', prompt: 'adjusting outfit with hands' },
    { id: 'normal_look_shoulder', prompt: 'looking over the shoulder' },
    { id: 'normal_weight_shift', prompt: 'shifting weight to one leg' },
    { id: 'normal_hands_back', prompt: 'hands behind the back' },
    { id: 'normal_hand_hip', prompt: 'one hand resting on the hip' },
    { id: 'normal_touch_hair', prompt: 'RAISING HAND TO ACTIVELY TOUCH OR TUCK HAIR, clear visible hand movement to head' },
    { id: 'normal_side_relax', prompt: 'relaxed side profile pose' },
    { id: 'normal_walking_place', prompt: 'walking in place motion' },
    { id: 'normal_lean_fwd', prompt: 'leaning slightly forward toward camera' },
    { id: 'normal_lean_back', prompt: 'leaning back slightly' },
    { id: 'normal_hands_together', prompt: 'clasping hands together in front' },
    { id: 'normal_play_sleeve', prompt: 'playing with sleeves with hands' },
    { id: 'normal_arms_down', prompt: 'arms resting naturally down at sides' },
    { id: 'normal_touch_acc', prompt: 'touching or holding accessories' },
    { id: 'normal_soft_smile', prompt: 'gentle soft smile expression' },
    { id: 'normal_confident', prompt: 'confident straight upright posture' }
];

export const PANTS_MODEL_POSES = [
    { id: 'pants_neutral_stand', prompt: 'Neutral Straight Stand' },
    { id: 'pants_hands_pockets', prompt: 'Hands in Both Pockets' },
    { id: 'pants_walking_step', prompt: 'Walking Step' },
    { id: 'pants_side_profile', prompt: 'Side Profile Walking' },
    { id: 'pants_back_view', prompt: 'Back View Hands in Pockets' },
    { id: 'pants_wide_stance', prompt: 'Wide Stance Street' },
    { id: 'pants_leg_cross', prompt: 'Leg Crossing Standing' },
    { id: 'pants_one_hand_pocket', prompt: 'One Hand in Pocket' },
    { id: 'pants_leaning_wall', prompt: 'Leaning Against Wall' },
    { id: 'pants_check_hem', prompt: 'Checking Hem (Look Down)' },
    { id: 'pants_thumbs_belt', prompt: 'Thumbs in Belt Loops' },
    { id: 'pants_hip_shift', prompt: 'Hip Shift' },
    { id: 'pants_low_kick', prompt: 'Low Motion Kick' },
    { id: 'pants_turning', prompt: 'Turning Pivot' },
    { id: 'pants_sitting_stool', prompt: 'Sitting on Stool' },
    { id: 'pants_leg_forward', prompt: 'One Leg Forward Static' },
    { id: 'pants_hand_thigh', prompt: 'Hand on Thigh' },
    { id: 'pants_ankles_crossed', prompt: 'Ankles Crossed' },
    { id: 'pants_hands_hips', prompt: 'Hands on Hips (Power)' },
    { id: 'pants_crouch', prompt: 'Urban Crouch' }
];

export const CUTE_MODEL_POSES = [
    { id: 'cute_peace_sign', prompt: 'Peace Sign near face, Cute expression' },
    { id: 'cute_shy_smile', prompt: 'Small Shy Smile, shoulders slightly up' },
    { id: 'cute_hand_cheek', prompt: 'Soft Hand touching Cheek, cute look' },
    { id: 'cute_puff_cheeks', prompt: 'Puffing Cheeks playfully' },
    { id: 'cute_mini_heart', prompt: 'Making Mini Heart with fingers' },
    { id: 'cute_double_heart', prompt: 'Double Heart Pose with hands' },
    { id: 'cute_looking_up', prompt: 'Looking Up with big eyes, Cute' },
    { id: 'cute_head_tilt', prompt: 'Head Tilt Softly to side' },
    { id: 'cute_hands_back', prompt: 'Hands Behind Back, leaning forward cute' },
    { id: 'cute_cheeks_surprise', prompt: 'Hands on Cheeks, Surprised expression' },
    { id: 'cute_small_wave', prompt: 'Small Hand Wave near shoulder' },
    { id: 'cute_finger_lip', prompt: 'Finger on Lip Softly' },
    { id: 'cute_wink', prompt: 'Cute Wink' },
    { id: 'cute_self_hug', prompt: 'Self Hug Pose' },
    { id: 'cute_shoulder_raise', prompt: 'Shoulder Raise Cute' },
    { id: 'cute_bunny_hands', prompt: 'Bunny Hands Pose' },
    { id: 'cute_hands_together', prompt: 'Soft Hands Clasp Together' },
    { id: 'cute_tiptoe', prompt: 'Standing on Tiptoe' },
    { id: 'cute_peek', prompt: 'Peeking From Side' },
    { id: 'cute_soft_laugh', prompt: 'Soft Laughing Pose, hand covering mouth' }
];

export const CINEMATIC_MODEL_POSES = [
    { id: 'cinematic_soft_stand', prompt: 'Soft Stand With Cinematic Calm' },
    { id: 'cinematic_half_profile', prompt: 'Half-Profile Slow Turn' },
    { id: 'cinematic_head_tilt', prompt: 'Subtle Head Tilt + Soft Gaze' },
    { id: 'cinematic_breath', prompt: 'Slow Breath Rise' },
    { id: 'cinematic_one_foot', prompt: 'One-Foot Forward Depth Pose' },
    { id: 'cinematic_upward', prompt: 'Upward Light Look' },
    { id: 'cinematic_look_away', prompt: 'Soft Look-Away' },
    { id: 'cinematic_lean', prompt: 'Micro Lean Forward' },
    { id: 'cinematic_hands_together', prompt: 'Hands Lightly Together' },
    { id: 'cinematic_touch_cloth', prompt: 'Gentle Clothing Touch' },
    { id: 'cinematic_shoulder', prompt: 'Light Shoulder Raise' },
    { id: 'cinematic_weight_shift', prompt: 'Slow Side Weight Shift' },
    { id: 'cinematic_step_back', prompt: 'Half Step Back' },
    { id: 'cinematic_look_down', prompt: 'Look Down Soft Mood' },
    { id: 'cinematic_arm_drop', prompt: 'Relaxed Arm Drop' },
    { id: 'cinematic_gesture', prompt: 'Gentle Air Gesture' },
    { id: 'cinematic_nod', prompt: 'Slight Head Nod' },
    { id: 'cinematic_over_shoulder', prompt: 'Over-Shoulder Calm Lookback' },
    { id: 'cinematic_close_still', prompt: 'Close-Up Stillness' },
    { id: 'cinematic_walk_place', prompt: 'Minimal Walk-in-Place' }
];

export const MIRROR_SELFIE_POSES = [
    { id: 'mirror_1', prompt: 'Chest Level Clean' },
    { id: 'mirror_2', prompt: 'Low Angle Feminine' },
    { id: 'mirror_3', prompt: 'Sideways Tilt Casual' },
    { id: 'mirror_4', prompt: 'Hair Touch Confident' },
    { id: 'mirror_5', prompt: 'Minimalist Chest Height' },
    { id: 'mirror_6', prompt: 'No Eye Contact Candid' },
    { id: 'mirror_7', prompt: 'Over Shoulder Turn' },
    { id: 'mirror_8', prompt: 'Hand Grip Close-Up' },
    { id: 'mirror_9', prompt: 'Sitting Floor Knee Up' },
    { id: 'mirror_10', prompt: 'Half Face Cover' },
    { id: 'mirror_11', prompt: 'Extended Arm Foreground' },
    { id: 'mirror_12', prompt: 'Wall Lean Relaxed' },
    { id: 'mirror_13', prompt: 'Overhead Dynamic' },
    { id: 'mirror_14', prompt: 'Hip Level Elegant' },
    { id: 'mirror_15', prompt: 'Symmetrical Center' },
    { id: 'mirror_16', prompt: 'Elegant Hand Detail' },
    { id: 'mirror_17', prompt: 'Full Body Low Waist' },
    { id: 'mirror_18', prompt: 'Portrait Soft Smile' },
    { id: 'mirror_19', prompt: 'Tuck Hair Candid' },
    { id: 'mirror_20', prompt: 'Diagonal Shoulder Level' }
];

export const GRASS_POSES = [
    { id: 'grass_1', prompt: 'Sitting Side Lean' },
    { id: 'grass_2', prompt: 'Sitting Cross-Legged' },
    { id: 'grass_3', prompt: 'Laying Side Lean' },
    { id: 'grass_4', prompt: 'Sweet Squat' },
    { id: 'grass_5', prompt: 'Laying Flat Relaxed' },
    { id: 'grass_6', prompt: 'Laying Side Pillow' },
    { id: 'grass_7', prompt: 'Sitting Legs Straight' },
    { id: 'grass_8', prompt: 'Sitting Knee Hug' },
    { id: 'grass_9', prompt: 'Squat Side Profile' },
    { id: 'grass_10', prompt: 'Sitting Grass Touch' },
    { id: 'grass_11', prompt: 'Laying Side Hair Spread' },
    { id: 'grass_12', prompt: 'Sitting Twist Look' },
    { id: 'grass_13', prompt: 'Sitting Cross-Legged Face' },
    { id: 'grass_14', prompt: 'Squat Side Touch' },
    { id: 'grass_15', prompt: 'Sitting Lean Back Sky' },
    { id: 'grass_16', prompt: 'Sitting Face Cup' },
    { id: 'grass_17', prompt: 'Laying Side Chin Prop' },
    { id: 'grass_18', prompt: 'Sitting Legs Side' },
    { id: 'grass_19', prompt: 'Sitting Lean Hands' },
    { id: 'grass_20', prompt: 'Lying Prone Chin' }
];

export const CINEMATIC_NEW_POSES = [
    { id: 'cine_new_1', prompt: 'Beach Entrance – Soft Motion' },
    { id: 'cine_new_2', prompt: 'Shoreline Walk – Hem Adjust' },
    { id: 'cine_new_3', prompt: 'Hilltop Breeze – Over Shoulder' },
    { id: 'cine_new_4', prompt: 'Grass Path Walk – Hand Brush' },
    { id: 'cine_new_5', prompt: 'Urban Crosswalk – Hand Gesture' },
    { id: 'cine_new_6', prompt: 'Sidewalk Tracking – Pocket Hands' },
    { id: 'cine_new_7', prompt: 'Outdoor Stairs Descent – Rail Touch' },
    { id: 'cine_new_8', prompt: 'Indoor Stairway – Hair Tuck' },
    { id: 'cine_new_9', prompt: 'Park Lane – Friendly Wave' },
    { id: 'cine_new_10', prompt: 'Park Bench – Cute Sit Pose' },
    { id: 'cine_new_11', prompt: 'Outdoor Cafe Walkby – Cup Hold Gesture' },
    { id: 'cine_new_12', prompt: 'Cafe Window – Chin Support' },
    { id: 'cine_new_13', prompt: 'Countryside Road – Backview Swing' },
    { id: 'cine_new_14', prompt: 'Pier Look – Rail Lean' },
    { id: 'cine_new_15', prompt: 'Modern Hallway – Hair Twist' },
    { id: 'cine_new_16', prompt: 'Rooftop Skyline – Pocket + Smile' },
    { id: 'cine_new_17', prompt: 'Street Market – Item Point Gesture' },
    { id: 'cine_new_18', prompt: 'Bookstore Aisle – Half Turn Smile' },
    { id: 'cine_new_19', prompt: 'Studio Clean – Two-hand Adjust' },
    { id: 'cine_new_20', prompt: 'Studio Dramatic – Walk-away Wave' }
];

export const STATIC_POSES = [
    { id: 'static_1', prompt: 'Standing Straight Facing Camera' },
    { id: 'static_2', prompt: 'Standing Straight Sideways (90°)' },
    { id: 'static_3', prompt: 'Standing Straight 45° to Camera' },
    { id: 'static_4', prompt: 'Standing Back to Camera' },
    { id: 'static_5', prompt: 'Standing with Weight on One Leg' },
    { id: 'static_6', prompt: 'Standing with Feet Slightly Apart' },
    { id: 'static_7', prompt: 'Standing with Lightly Crossed Legs' },
    { id: 'static_8', prompt: 'Standing Near Wall (No Lean)' },
    { id: 'static_9', prompt: 'Standing Near Railing (No Lean)' },
    { id: 'static_10', prompt: 'Leaning Straight Against Wall (Back)' },
    { id: 'static_11', prompt: 'Leaning Against Wall (Shoulder)' },
    { id: 'static_12', prompt: 'Leaning Against Wall (Side Back)' },
    { id: 'static_13', prompt: 'Leaning Against Railing Naturally' },
    { id: 'static_14', prompt: 'Half-Sitting on Railing/Edge' },
    { id: 'static_15', prompt: 'Sitting Upright on Chair' },
    { id: 'static_16', prompt: 'Sitting Sideways on Chair' },
    { id: 'static_17', prompt: 'Sitting Relaxed on Chair' },
    { id: 'static_18', prompt: 'Sitting on Bench (Neutral)' },
    { id: 'static_19', prompt: 'Sitting on Chair Edge (Neutral)' },
    { id: 'static_20', prompt: 'Sitting on Floor Leaning on Wall' },
    { id: 'static_21', prompt: 'Close-Up Facing Forward' },
    { id: 'static_22', prompt: 'Close-Up Slight Side Angle' },
    { id: 'static_23', prompt: 'Close-Up Facing 45°' },
    { id: 'static_24', prompt: 'Full Body Stiff Neutral Stance' },
    { id: 'static_25', prompt: 'Full Body Natural Balanced Standing' }
];

export const CINEMATIC_SITTING_POSES = [
    { id: 'cine_sit_1', prompt: 'Sit & Lean Forward' },
    { id: 'cine_sit_2', prompt: 'Cross-Leg Elegant' },
    { id: 'cine_sit_3', prompt: 'Relaxed Lean Back' },
    { id: 'cine_sit_4', prompt: 'Side-Sit Soft' },
    { id: 'cine_sit_5', prompt: 'One Knee Up Pose' },
    { id: 'cine_sit_6', prompt: 'Chair Edge Minimalist' },
    { id: 'cine_sit_7', prompt: 'Playful Lean Forward' },
    { id: 'cine_sit_8', prompt: 'Power Sit' },
    { id: 'cine_sit_9', prompt: 'Side Lean on Armrest' },
    { id: 'cine_sit_10', prompt: 'Criss-Cross Casual' },
    { id: 'cine_sit_11', prompt: 'Chair Backwards Pose' },
    { id: 'cine_sit_12', prompt: 'Soft Feminine Sit' },
    { id: 'cine_sit_13', prompt: 'Wide-Leg Fashion Sit' },
    { id: 'cine_sit_14', prompt: 'Leg-Over-Leg Relax' },
    { id: 'cine_sit_15', prompt: 'Dreamy Lean Side' },
    { id: 'cine_sit_16', prompt: 'Half Turn Sit' },
    { id: 'cine_sit_17', prompt: 'Upright Clean Pose' },
    { id: 'cine_sit_18', prompt: 'Floating Hands' },
    { id: 'cine_sit_19', prompt: 'Knee Hug Sit' },
    { id: 'cine_sit_20', prompt: 'Cinematic Window Sit' }
];

export const SITTING_MODEL_POSES = [
    { id: 'sitting_1', prompt: 'Sitting Relaxed Straight' },
    { id: 'sitting_2', prompt: 'Sitting Sideways 45°' },
    { id: 'sitting_3', prompt: 'Sitting Cross-Legged' },
    { id: 'sitting_4', prompt: 'One Knee Raised' },
    { id: 'sitting_5', prompt: 'Lean Back (Hands Behind)' },
    { id: 'sitting_6', prompt: 'Lean Forward (Hands Clasped)' },
    { id: 'sitting_7', prompt: 'Legs Crossed' },
    { id: 'sitting_8', prompt: 'Half-Sit / Squat' },
    { id: 'sitting_9', prompt: 'Sitting Side + Hair Touch' },
    { id: 'sitting_10', prompt: 'Hands Behind Head' }
];

export const MODEL_EXPRESSIONS = [
    { id: 'expr_natural_smile', prompt: 'smiling naturally, reaching up to touch or tuck hair' },
    { id: 'expr_elegant_smile', prompt: 'elegant slight smile, hand resting on chin' },
    { id: 'expr_cute_pout', prompt: 'cute pout expression, pointing at cheek' },
    { id: 'expr_subtle_pout', prompt: 'subtle pout, finger touching lower lip' },
    { id: 'expr_neutral_calm', prompt: 'neutral calm expression, hand resting on side of neck' },
    { id: 'expr_serious_elegant', prompt: 'serious elegant look, hands adjusting collar' },
    { id: 'expr_gentle_serene', prompt: 'gentle serene look, hand resting on face cheek' },
    { id: 'expr_confident_smile', prompt: 'confident smile, hand touching jawline' },
    { id: 'expr_focus', prompt: 'focused expression, touching temple with one finger' },
    { id: 'expr_cool_neutral', prompt: 'cool neutral expression, playing with a necklace' },
    { id: 'expr_cute_soft', prompt: 'cute soft expression, both hands cupping the face' },
    { id: 'expr_calm_happy', prompt: 'calm happy look, hand tucking hair behind the ear' },
    { id: 'expr_mysterious', prompt: 'mysterious look, index finger on lips' },
    { id: 'expr_soft_confidence', prompt: 'soft confidence, hand resting on opposite shoulder' },
    { id: 'expr_natural_relaxed', prompt: 'natural relaxed look, hand resting on chest' },
    { id: 'expr_serious_soft', prompt: 'serious but soft look, resting cheek on hand' },
    { id: 'expr_calm_playful', prompt: 'calm playful look, hand partially covering mouth' },
    { id: 'expr_fresh_bright', prompt: 'fresh bright expression, hands lifting hair up' },
    { id: 'expr_curious', prompt: 'curious expression, holding chin thoughtfully' },
    { id: 'expr_elegant_smirk', prompt: 'elegant smirk, hand adjusting glasses' },
    { id: 'cine_soft_confident', prompt: 'Soft Confident' },
    { id: 'cine_elegant_serious', prompt: 'Elegant Serious' },
    { id: 'cine_gentle_smile', prompt: 'Gentle Smile' },
    { id: 'cine_look_away_calm', prompt: 'Look Away Calm' },
    { id: 'cine_playful_soft', prompt: 'Playful Soft' },
    { id: 'cine_fashion_model_blank', prompt: 'Blank Face' },
    { id: 'cine_fierce_confidence', prompt: 'Fierce Confidence' },
    { id: 'cine_soft_sad_aesthetic', prompt: 'Soft Sad Aesthetic' },
    { id: 'cine_warm_happy_smile', prompt: 'Warm Happy Smile' },
    { id: 'cine_mysterious_look_down', prompt: 'Mysterious Look Down' },
    { id: 'cine_cute_soft_expression', prompt: 'Cute Soft Expression' },
    { id: 'cine_sharp_side_glance', prompt: 'Sharp Side Glance' },
    { id: 'cine_joyful_laugh', prompt: 'Joyful Laugh' },
    { id: 'cine_calm_elegant', prompt: 'Calm Elegant' },
    { id: 'cine_shy_look_side', prompt: 'Shy Look Side' },
    { id: 'cine_power_fashion', prompt: 'Power Fashion' },
    { id: 'cine_minimalist_blank', prompt: 'Minimalist Blank' },
    { id: 'cine_dreamy_upward', prompt: 'Dreamy Upward' },
    { id: 'cine_hidden_smile', prompt: 'Hidden Smile' },
    { id: 'cine_cinematic_natural', prompt: 'Cinematic Natural' }
];

export const CAMERA_PRESETS = [
    { id: 'ultra_realistic', label: 'Ultra Realistic Studio' },
    { id: 'natural_eye', label: 'Natural Eye' },
    { id: 'high_end_editorial', label: 'High-End Editorial' },
    { id: 'k_style_beauty', label: 'K-Style Beauty' },
    { id: 'outdoor_realistic', label: 'Outdoor Realistic' }
];

export const BACKGROUND_CATEGORIES = [
    { id: 'cinematic_premium', label: 'Cinematic Premium', presets: [{ id: 'golden_hour_rooftop', prompt: 'Golden Hour Rooftop Cityscape' }] },
    { id: 'studio_background', label: 'Studio Background', presets: [{ id: 'studio_white', prompt: 'White Studio' }] }
];

export const FOOTWEAR_OPTIONS = { women: ["Heels", "Sneakers", "Boots"], men: ["Sneakers", "Boots", "Loafers"] };
export const ACCESSORY_CATEGORIES = [{ id: 'bags', label: 'Bags', items: [{ id: 'bag_leather', prompt: 'holding a leather handbag', label: 'Leather Handbag' }] }];
export const FACE_ACCESSORY_CATEGORIES = [{ id: 'eyewear', label: 'Eyewear', items: [{ id: 'eye_aviator', prompt: 'wearing aviator sunglasses', label: 'Aviator Sunglasses' }] }];

// --- Engine Helper Functions ---

function parseCustomPrompt(raw: string): string {
    if (!raw.trim()) return '';
    if (raw.trim().startsWith('{')) {
        try {
            const parsed = JSON.parse(raw);
            return Object.entries(parsed).map(([key, val]) => `${key}: ${val}`).join('. ');
        } catch (e) {
            return raw;
        }
    }
    return raw;
}

/**
 * Ensures that footwear is generated by adding mandatory descriptive parts.
 */
function buildEnhancedAppearancePrompt(base: string, footwear?: string, accessory?: string, faceAccessory?: string): string {
    let result = base;
    if (footwear && footwear !== 'None') {
        result += `. MANDATORY: The model is wearing ${footwear} on their feet. The ${footwear} must be clearly visible and rendered in full detail.`;
    }
    if (accessory) {
        result += `. Additionally, the model is ${accessory}.`;
    }
    if (faceAccessory) {
        result += `. The model is also ${faceAccessory}.`;
    }
    return result;
}

// --- Base Generation Helper ---

async function callGeminiApi(prompt: string, parts: any[], quality: QualityLevel, userKey?: string): Promise<string> {
    const apiKey = userKey || process.env.API_KEY;
    if (!apiKey) throw new Error("API Key is required.");
    
    const ai = new GoogleGenAI({ apiKey });
    const modelName = (quality === 'hd' || quality === '4k') ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
    const config: any = { imageConfig: { aspectRatio: '9:16' } };
    if (modelName === 'gemini-3-pro-image-preview') config.imageConfig.imageSize = quality === '4k' ? '4K' : '2K';

    try {
        const response = await ai.models.generateContent({ 
            model: modelName, 
            contents: { parts: [...parts, { text: prompt }] }, 
            config 
        });
        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) if (part.inlineData) return part.inlineData.data;
        }
        throw new Error("No image generated.");
    } catch (error: any) { throw new Error(error.message || "Failed to generate image."); }
}

// --- Public Helper Mappers ---

function getAngleLabel(angleId: string, isCinematic: boolean): string {
    const arr = isCinematic ? CINEMATIC_CAMERA_ANGLES : [...TOP_CAMERA_ANGLES, ...PANTS_CAMERA_ANGLES];
    return arr.find(a => a.id === angleId)?.label || '';
}

function getPoseText(poseId: string): string {
    return [...MODEL_POSES, ...PANTS_MODEL_POSES, ...CUTE_MODEL_POSES, ...CINEMATIC_MODEL_POSES, ...MIRROR_SELFIE_POSES, ...GRASS_POSES, ...CINEMATIC_NEW_POSES, ...STATIC_POSES, ...CINEMATIC_SITTING_POSES, ...SITTING_MODEL_POSES].find(p => p.id === poseId)?.prompt || '';
}

// --- Main Exported Generation Functions ---

export async function generateUgcTryOnImages(baseModel: ImageFile, pantsImage: ImageFile | null, topImage: ImageFile | null, setelanImage: ImageFile | null, quality: QualityLevel, pantType: string, material: string, topType: string, topMaterial: string, setelanType: string, setelanMaterial: string, footwear: string | undefined, customInput: string | undefined, userKey?: string): Promise<string[]> {
    const parts = [{ inlineData: { mimeType: baseModel.mimeType, data: baseModel.base64 } }];
    if (pantsImage) parts.push({ inlineData: { mimeType: pantsImage.mimeType, data: pantsImage.base64 } });
    if (topImage) parts.push({ inlineData: { mimeType: topImage.mimeType, data: topImage.base64 } });
    if (setelanImage) parts.push({ inlineData: { mimeType: setelanImage.mimeType, data: setelanImage.base64 } });

    let clothingDetails = "";
    if (setelanImage) clothingDetails = `${setelanType} (${setelanMaterial})`;
    else {
        const items = [];
        if (topImage) items.push(`${topType} (${topMaterial})`);
        if (pantsImage) items.push(`${pantType} (${material})`);
        clothingDetails = items.join(" and ");
    }

    const angles: ('front' | 'left' | 'right')[] = ['front', 'left', 'right'];
    const images: string[] = [];

    for (const angle of angles) {
        const angleText = angle === 'front' ? 'facing the camera' : `turned slightly to the ${angle}`;
        let basePrompt = `Realistic UGC style try-on photo of model wearing ${clothingDetails}, ${angleText}. ${parseCustomPrompt(customInput || '')}`;
        const finalPrompt = buildEnhancedAppearancePrompt(basePrompt, footwear);
        images.push(await callGeminiApi(finalPrompt, parts, quality, userKey));
    }
    return images;
}

export async function generateUgcFabricTouchImages(baseModel: ImageFile, pantsImage: ImageFile | null, topImage: ImageFile | null, setelanImage: ImageFile | null, quality: QualityLevel, pantType: string, material: string, topType: string, topMaterial: string, setelanType: string, setelanMaterial: string, footwear: string | undefined, customInput: string | undefined, userKey?: string): Promise<string[]> {
    const parts = [{ inlineData: { mimeType: baseModel.mimeType, data: baseModel.base64 } }];
    if (pantsImage) parts.push({ inlineData: { mimeType: pantsImage.mimeType, data: pantsImage.base64 } });
    if (topImage) parts.push({ inlineData: { mimeType: topImage.mimeType, data: topImage.base64 } });
    if (setelanImage) parts.push({ inlineData: { mimeType: setelanImage.mimeType, data: setelanImage.base64 } });

    let clothingDetails = "";
    if (setelanImage) clothingDetails = `${setelanType} (${setelanMaterial})`;
    else {
        const items = [];
        if (topImage) items.push(`${topType} (${topMaterial})`);
        if (pantsImage) items.push(`${pantType} (${material})`);
        clothingDetails = items.join(" and ");
    }

    const images: string[] = [];
    const p1 = buildEnhancedAppearancePrompt(`Realistic UGC style photo, model wearing ${clothingDetails}, hand gently touching the fabric to show texture. ${parseCustomPrompt(customInput || '')}`, footwear);
    const p2 = buildEnhancedAppearancePrompt(`Realistic UGC style photo, side angle, model wearing ${clothingDetails}, adjusting the fabric. ${parseCustomPrompt(customInput || '')}`, footwear);
    
    images.push(await callGeminiApi(p1, parts, quality, userKey));
    images.push(await callGeminiApi(p2, parts, quality, userKey));
    
    return images;
}

export async function generateUgcSideTurnImages(baseModel: ImageFile, pantsImage: ImageFile | null, topImage: ImageFile | null, setelanImage: ImageFile | null, quality: QualityLevel, pantType: string, material: string, topType: string, topMaterial: string, setelanType: string, setelanMaterial: string, footwear: string | undefined, customInput: string | undefined, userKey?: string): Promise<string[]> {
    const parts = [{ inlineData: { mimeType: baseModel.mimeType, data: baseModel.base64 } }];
    if (pantsImage) parts.push({ inlineData: { mimeType: pantsImage.mimeType, data: pantsImage.base64 } });
    if (topImage) parts.push({ inlineData: { mimeType: topImage.mimeType, data: topImage.base64 } });
    if (setelanImage) parts.push({ inlineData: { mimeType: setelanImage.mimeType, data: setelanImage.base64 } });

    let clothingDetails = "";
    if (setelanImage) clothingDetails = `${setelanType} (${setelanMaterial})`;
    else {
        const items = [];
        if (topImage) items.push(`${topType} (${topMaterial})`);
        if (pantsImage) items.push(`${pantType} (${material})`);
        clothingDetails = items.join(" and ");
    }

    const images: string[] = [];
    images.push(await callGeminiApi(buildEnhancedAppearancePrompt(`Realistic UGC style photo, model wearing ${clothingDetails}, 30 degree side turn. ${parseCustomPrompt(customInput || '')}`, footwear), parts, quality, userKey));
    images.push(await callGeminiApi(buildEnhancedAppearancePrompt(`Realistic UGC style photo, model wearing ${clothingDetails}, 45 degree side turn. ${parseCustomPrompt(customInput || '')}`, footwear), parts, quality, userKey));
    
    return images;
}

export async function generateUgcMirrorCheckImages(baseModel: ImageFile, pantsImage: ImageFile | null, topImage: ImageFile | null, setelanImage: ImageFile | null, quality: QualityLevel, pantType: string, material: string, topType: string, topMaterial: string, setelanType: string, setelanMaterial: string, footwear: string | undefined, customInput: string | undefined, userKey?: string): Promise<string[]> {
    const parts = [{ inlineData: { mimeType: baseModel.mimeType, data: baseModel.base64 } }];
    if (pantsImage) parts.push({ inlineData: { mimeType: pantsImage.mimeType, data: pantsImage.base64 } });
    if (topImage) parts.push({ inlineData: { mimeType: topImage.mimeType, data: topImage.base64 } });
    if (setelanImage) parts.push({ inlineData: { mimeType: setelanImage.mimeType, data: setelanImage.base64 } });

    let clothingDetails = "";
    if (setelanImage) clothingDetails = `${setelanType} (${setelanMaterial})`;
    else {
        const items = [];
        if (topImage) items.push(`${topType} (${topMaterial})`);
        if (pantsImage) items.push(`${pantType} (${material})`);
        clothingDetails = items.join(" and ");
    }

    const images: string[] = [];
    images.push(await callGeminiApi(buildEnhancedAppearancePrompt(`Realistic UGC style mirror reflection photo of model wearing ${clothingDetails}, looking in the mirror. No phone visible. ${parseCustomPrompt(customInput || '')}`, footwear), parts, quality, userKey));
    images.push(await callGeminiApi(buildEnhancedAppearancePrompt(`Realistic UGC style mirror reflection photo of model wearing ${clothingDetails}, mid-shot. No phone visible. ${parseCustomPrompt(customInput || '')}`, footwear), parts, quality, userKey));
    
    return images;
}

// --- Additional UGC Functions ---

/**
 * Generates UGC style images for checking bottoms fit.
 */
export async function generateUgcBottomsFitCheckImages(baseModel: ImageFile, pantsImage: ImageFile | null, topImage: ImageFile | null, setelanImage: ImageFile | null, quality: QualityLevel, pantType: string, material: string, topType: string, topMaterial: string, setelanType: string, setelanMaterial: string, footwear: string | undefined, customInput: string | undefined, userKey?: string): Promise<string[]> {
    const parts = [{ inlineData: { mimeType: baseModel.mimeType, data: baseModel.base64 } }];
    if (pantsImage) parts.push({ inlineData: { mimeType: pantsImage.mimeType, data: pantsImage.base64 } });
    if (topImage) parts.push({ inlineData: { mimeType: topImage.mimeType, data: topImage.base64 } });
    if (setelanImage) parts.push({ inlineData: { mimeType: setelanImage.mimeType, data: setelanImage.base64 } });

    let clothingDetails = "";
    if (setelanImage) clothingDetails = `${setelanType} (${setelanMaterial})`;
    else {
        const items = [];
        if (topImage) items.push(`${topType} (${topMaterial})`);
        if (pantsImage) items.push(`${pantType} (${material})`);
        clothingDetails = items.join(" and ");
    }

    const prompts = [
        `Realistic UGC style photo, focus on the fit of ${clothingDetails} around the waist and hips, model standing naturally. ${parseCustomPrompt(customInput || '')}`,
        `Realistic UGC style photo, focus on how ${clothingDetails} sits on the thighs and legs, model in a relaxed stance. ${parseCustomPrompt(customInput || '')}`,
        `Realistic UGC style photo, showing the overall fit of the lower body in ${clothingDetails}. ${parseCustomPrompt(customInput || '')}`
    ];
    
    return Promise.all(prompts.map(p => callGeminiApi(buildEnhancedAppearancePrompt(p, footwear), parts, quality, userKey)));
}

/**
 * Generates UGC style images for sitting and standing poses.
 */
export async function generateUgcSitStandImages(baseModel: ImageFile, pantsImage: ImageFile | null, topImage: ImageFile | null, setelanImage: ImageFile | null, quality: QualityLevel, pantType: string, material: string, topType: string, topMaterial: string, setelanType: string, setelanMaterial: string, footwear: string | undefined, customInput: string | undefined, userKey?: string): Promise<string[]> {
    const parts = [{ inlineData: { mimeType: baseModel.mimeType, data: baseModel.base64 } }];
    if (pantsImage) parts.push({ inlineData: { mimeType: pantsImage.mimeType, data: pantsImage.base64 } });
    if (topImage) parts.push({ inlineData: { mimeType: topImage.mimeType, data: topImage.base64 } });
    if (setelanImage) parts.push({ inlineData: { mimeType: setelanImage.mimeType, data: setelanImage.base64 } });

    let clothingDetails = "";
    if (setelanImage) clothingDetails = `${setelanType} (${setelanMaterial})`;
    else {
        const items = [];
        if (topImage) items.push(`${topType} (${topMaterial})`);
        if (pantsImage) items.push(`${pantType} (${material})`);
        clothingDetails = items.join(" and ");
    }

    const prompts = [
        `Realistic UGC style photo, model wearing ${clothingDetails} while sitting comfortably on a chair. ${parseCustomPrompt(customInput || '')}`,
        `Realistic UGC style photo, model standing up from a chair in ${clothingDetails}, showing movement. ${parseCustomPrompt(customInput || '')}`,
        `Realistic UGC style photo, model standing naturally in ${clothingDetails}. ${parseCustomPrompt(customInput || '')}`
    ];
    
    return Promise.all(prompts.map(p => callGeminiApi(buildEnhancedAppearancePrompt(p, footwear), parts, quality, userKey)));
}

/**
 * Generates UGC style images for bottoms fabric and detail check.
 */
export async function generateUgcBottomsFabricImages(baseModel: ImageFile, pantsImage: ImageFile | null, topImage: ImageFile | null, setelanImage: ImageFile | null, quality: QualityLevel, pantType: string, material: string, topType: string, topMaterial: string, setelanType: string, setelanMaterial: string, footwear: string | undefined, customInput: string | undefined, userKey?: string): Promise<string[]> {
    const parts = [{ inlineData: { mimeType: baseModel.mimeType, data: baseModel.base64 } }];
    if (pantsImage) parts.push({ inlineData: { mimeType: pantsImage.mimeType, data: pantsImage.base64 } });
    if (topImage) parts.push({ inlineData: { mimeType: topImage.mimeType, data: topImage.base64 } });
    if (setelanImage) parts.push({ inlineData: { mimeType: setelanImage.mimeType, data: setelanImage.base64 } });

    let clothingDetails = "";
    if (setelanImage) clothingDetails = `${setelanType} (${setelanMaterial})`;
    else {
        const items = [];
        if (topImage) items.push(`${topType} (${topMaterial})`);
        if (pantsImage) items.push(`${pantType} (${material})`);
        clothingDetails = items.join(" and ");
    }

    const prompts = [
        `Realistic UGC style close-up photo of the fabric texture and stitching of ${clothingDetails}. ${parseCustomPrompt(customInput || '')}`,
        `Realistic UGC style photo showing the hem and bottom edges of ${clothingDetails}. ${parseCustomPrompt(customInput || '')}`
    ];
    
    return Promise.all(prompts.map(p => callGeminiApi(buildEnhancedAppearancePrompt(p, footwear), parts, quality, userKey)));
}

/**
 * Generates UGC style images for side profile and fabric fall check.
 */
export async function generateUgcSideProfileFallImages(baseModel: ImageFile, pantsImage: ImageFile | null, topImage: ImageFile | null, setelanImage: ImageFile | null, quality: QualityLevel, pantType: string, material: string, topType: string, topMaterial: string, setelanType: string, setelanMaterial: string, footwear: string | undefined, customInput: string | undefined, userKey?: string): Promise<string[]> {
    const parts = [{ inlineData: { mimeType: baseModel.mimeType, data: baseModel.base64 } }];
    if (pantsImage) parts.push({ inlineData: { mimeType: pantsImage.mimeType, data: pantsImage.base64 } });
    if (topImage) parts.push({ inlineData: { mimeType: topImage.mimeType, data: topImage.base64 } });
    if (setelanImage) parts.push({ inlineData: { mimeType: setelanImage.mimeType, data: setelanImage.base64 } });

    let clothingDetails = "";
    if (setelanImage) clothingDetails = `${setelanType} (${setelanMaterial})`;
    else {
        const items = [];
        if (topImage) items.push(`${topType} (${topMaterial})`);
        if (pantsImage) items.push(`${pantType} (${material})`);
        clothingDetails = items.join(" and ");
    }

    const prompts = [
        `Realistic UGC style side profile photo of model wearing ${clothingDetails}, showing how the fabric falls. ${parseCustomPrompt(customInput || '')}`,
        `Realistic UGC style side angle photo of model in ${clothingDetails}, showing the silhouette. ${parseCustomPrompt(customInput || '')}`
    ];
    
    return Promise.all(prompts.map(p => callGeminiApi(buildEnhancedAppearancePrompt(p, footwear), parts, quality, userKey)));
}

/**
 * Generates UGC style images for checking length and proportion.
 */
export async function generateUgcLengthProportionImages(baseModel: ImageFile, pantsImage: ImageFile | null, topImage: ImageFile | null, setelanImage: ImageFile | null, quality: QualityLevel, pantType: string, material: string, topType: string, topMaterial: string, setelanType: string, setelanMaterial: string, footwear: string | undefined, customInput: string | undefined, userKey?: string): Promise<string[]> {
    const parts = [{ inlineData: { mimeType: baseModel.mimeType, data: baseModel.base64 } }];
    if (pantsImage) parts.push({ inlineData: { mimeType: pantsImage.mimeType, data: pantsImage.base64 } });
    if (topImage) parts.push({ inlineData: { mimeType: topImage.mimeType, data: topImage.base64 } });
    if (setelanImage) parts.push({ inlineData: { mimeType: setelanImage.mimeType, data: setelanImage.base64 } });

    let clothingDetails = "";
    if (setelanImage) clothingDetails = `${setelanType} (${setelanMaterial})`;
    else {
        const items = [];
        if (topImage) items.push(`${topType} (${topMaterial})`);
        if (pantsImage) items.push(`${pantType} (${material})`);
        clothingDetails = items.join(" and ");
    }

    const prompts = [
        `Realistic UGC style full body photo of model wearing ${clothingDetails}, showing overall length and proportion. ${parseCustomPrompt(customInput || '')}`,
        `Realistic UGC style full body photo from a slightly lower angle of model in ${clothingDetails}. ${parseCustomPrompt(customInput || '')}`
    ];
    
    return Promise.all(prompts.map(p => callGeminiApi(buildEnhancedAppearancePrompt(p, footwear), parts, quality, userKey)));
}

// --- Tops Functions ---

export async function generateUgcNecklineCheck(baseModel: ImageFile, topImage: ImageFile, topType: string, topMaterial: string, pantsImage: ImageFile | null, pantType: string | null, pantMaterial: string | null, quality: QualityLevel, footwear: string | undefined, customInput: string | undefined, userKey?: string): Promise<string[]> {
    const parts = [{ inlineData: { mimeType: baseModel.mimeType, data: baseModel.base64 } }, { inlineData: { mimeType: topImage.mimeType, data: topImage.base64 } }];
    if (pantsImage) parts.push({ inlineData: { mimeType: pantsImage.mimeType, data: pantsImage.base64 } });
    const clothingDetails = `${topType} (${topMaterial})${pantsImage ? ` worn with ${pantType} (${pantMaterial})` : ''}`;
    
    const prompts = [
        `Female wearing ${clothingDetails}, front upper-body view, focus on neckline and collar, relaxed posture, neutral expression, natural indoor light, realistic smartphone photo. ${parseCustomPrompt(customInput || '')}`,
        `Same person and outfit, slight head tilt, collar clearly visible, candid moment, natural lighting, UGC style. ${parseCustomPrompt(customInput || '')}`,
        `Same person gently adjusting collar with one hand, subtle motion, authentic everyday look, handheld phone feel. ${parseCustomPrompt(customInput || '')}`
    ];
    
    return Promise.all(prompts.map(p => callGeminiApi(buildEnhancedAppearancePrompt(p, footwear), parts, quality, userKey)));
}

export async function generateUgcSleeveMovement(baseModel: ImageFile, topImage: ImageFile, topType: string, topMaterial: string, pantsImage: ImageFile | null, pantType: string | null, pantMaterial: string | null, quality: QualityLevel, footwear: string | undefined, customInput: string | undefined, userKey?: string): Promise<string[]> {
    const parts = [{ inlineData: { mimeType: baseModel.mimeType, data: baseModel.base64 } }, { inlineData: { mimeType: topImage.mimeType, data: topImage.base64 } }];
    if (pantsImage) parts.push({ inlineData: { mimeType: pantsImage.mimeType, data: pantsImage.base64 } });
    const clothingDetails = `${topType} (${topMaterial})${pantsImage ? ` worn with ${pantType} (${pantMaterial})` : ''}`;

    const prompts = [
        `Female wearing ${clothingDetails}, front view, arms resting naturally down, sleeves clearly visible, casual stance. ${parseCustomPrompt(customInput || '')}`,
        `Same person slightly lifting one arm, showing sleeve length and movement, natural candid pose. ${parseCustomPrompt(customInput || '')}`,
        `Same outfit, both arms relaxed again with slight bend, showing fabric return and comfort. ${parseCustomPrompt(customInput || '')}`
    ];
    
    return Promise.all(prompts.map(p => callGeminiApi(buildEnhancedAppearancePrompt(p, footwear), parts, quality, userKey)));
}

export async function generateUgcShoulderFit(baseModel: ImageFile, topImage: ImageFile, topType: string, topMaterial: string, pantsImage: ImageFile | null, pantType: string | null, pantMaterial: string | null, quality: QualityLevel, footwear: string | undefined, customInput: string | undefined, userKey?: string): Promise<string[]> {
    const parts = [{ inlineData: { mimeType: baseModel.mimeType, data: baseModel.base64 } }, { inlineData: { mimeType: topImage.mimeType, data: topImage.base64 } }];
    if (pantsImage) parts.push({ inlineData: { mimeType: pantsImage.mimeType, data: pantsImage.base64 } });
    const clothingDetails = `${topType} (${topMaterial})${pantsImage ? ` worn with ${pantType} (${pantMaterial})` : ''}`;

    const prompts = [
        `Female wearing ${clothingDetails}, front view, shoulders relaxed, natural posture, casual environment. ${parseCustomPrompt(customInput || '')}`,
        `Same person slight shoulder roll, showing how fabric sits on shoulders, candid moment. ${parseCustomPrompt(customInput || '')}`,
        `Same person settled posture, relaxed shoulders, realistic everyday UGC photo. ${parseCustomPrompt(customInput || '')}`
    ];
    
    return Promise.all(prompts.map(p => callGeminiApi(buildEnhancedAppearancePrompt(p, footwear), parts, quality, userKey)));
}

export async function generateUgcLayeringCompatibility(baseModel: ImageFile, topImage: ImageFile, topType: string, topMaterial: string, pantsImage: ImageFile | null, pantType: string | null, pantMaterial: string | null, quality: QualityLevel, footwear: string | undefined, customInput: string | undefined, userKey?: string): Promise<string[]> {
    const parts = [{ inlineData: { mimeType: baseModel.mimeType, data: baseModel.base64 } }, { inlineData: { mimeType: topImage.mimeType, data: topImage.base64 } }];
    if (pantsImage) parts.push({ inlineData: { mimeType: pantsImage.mimeType, data: pantsImage.base64 } });
    const clothingDetails = `${topType} (${topMaterial})${pantsImage ? ` worn with ${pantType} (${pantMaterial})` : ''}`;

    const prompts = [
        `Female wearing ${clothingDetails} alone, front view, relaxed casual stance, natural light. ${parseCustomPrompt(customInput || '')}`,
        `Same person lightly holding a thin open outer layer, not covering the top, showing layering compatibility. ${parseCustomPrompt(customInput || '')}`,
        `Same outfit with outer layer still open, relaxed posture, natural everyday look. ${parseCustomPrompt(customInput || '')}`
    ];
    
    return Promise.all(prompts.map(p => callGeminiApi(buildEnhancedAppearancePrompt(p, footwear), parts, quality, userKey)));
}

export async function generateUgcComfortHold(baseModel: ImageFile, topImage: ImageFile, topType: string, topMaterial: string, pantsImage: ImageFile | null, pantType: string | null, pantMaterial: string | null, quality: QualityLevel, footwear: string | undefined, customInput: string | undefined, userKey?: string): Promise<string[]> {
    const parts = [{ inlineData: { mimeType: baseModel.mimeType, data: baseModel.base64 } }, { inlineData: { mimeType: topImage.mimeType, data: topImage.base64 } }];
    if (pantsImage) parts.push({ inlineData: { mimeType: pantsImage.mimeType, data: pantsImage.base64 } });
    const clothingDetails = `${topType} (${topMaterial})${pantsImage ? ` worn with ${pantType} (${pantMaterial})` : ''}`;

    const prompts = [
        `Female wearing ${clothingDetails}, front view, relaxed posture, hands near torso, UGC style. ${parseCustomPrompt(customInput || '')}`,
        `Same person lightly crossing arms, showing comfort and softness, candid feel. ${parseCustomPrompt(customInput || '')}`,
        `Same person releasing arms back to relaxed position, natural daily look. ${parseCustomPrompt(customInput || '')}`
    ];
    
    return Promise.all(prompts.map(p => callGeminiApi(buildEnhancedAppearancePrompt(p, footwear), parts, quality, userKey)));
}

// --- Bottoms Functions ---

export async function generateUgcWaistHipFitCheck(baseModel: ImageFile, pantsImage: ImageFile, pantType: string, pantMaterial: string, topImage: ImageFile | null, topType: string | null, topMaterial: string | null, quality: QualityLevel, footwear: string | undefined, customInput: string | undefined, userKey?: string): Promise<string[]> {
    const parts = [{ inlineData: { mimeType: baseModel.mimeType, data: baseModel.base64 } }, { inlineData: { mimeType: pantsImage.mimeType, data: pantsImage.base64 } }];
    if (topImage) parts.push({ inlineData: { mimeType: topImage.mimeType, data: topImage.base64 } });
    const clothingDetails = `${pantType} (${pantMaterial})${topImage ? ` paired with ${topType} (${topMaterial})` : ''}`;

    const prompts = [
        `Female wearing ${clothingDetails}, front waist-to-knee framing, relaxed standing posture. ${parseCustomPrompt(customInput || '')}`,
        `Same person lightly adjusting waistband with one hand, candid everyday motion. ${parseCustomPrompt(customInput || '')}`,
        `Same person standing relaxed again, showing natural fit after adjustment. ${parseCustomPrompt(customInput || '')}`
    ];
    
    return Promise.all(prompts.map(p => callGeminiApi(buildEnhancedAppearancePrompt(p, footwear), parts, quality, userKey)));
}

export async function generateUgcThighKneeSpaceCheck(baseModel: ImageFile, pantsImage: ImageFile, pantType: string, pantMaterial: string, topImage: ImageFile | null, topType: string | null, topMaterial: string | null, quality: QualityLevel, footwear: string | undefined, customInput: string | undefined, userKey?: string): Promise<string[]> {
    const parts = [{ inlineData: { mimeType: baseModel.mimeType, data: baseModel.base64 } }, { inlineData: { mimeType: pantsImage.mimeType, data: pantsImage.base64 } }];
    if (topImage) parts.push({ inlineData: { mimeType: topImage.mimeType, data: topImage.base64 } });
    const clothingDetails = `${pantType} (${pantMaterial})${topImage ? ` paired with ${topType} (${topMaterial})` : ''}`;

    const prompts = [
        `Female wearing ${clothingDetails}, front view, legs straight and relaxed. ${parseCustomPrompt(customInput || '')}`,
        `Same person slight knee bend, showing space and flexibility. ${parseCustomPrompt(customInput || '')}`,
        `Same person returning to relaxed standing posture, natural UGC style. ${parseCustomPrompt(customInput || '')}`
    ];
    
    return Promise.all(prompts.map(p => callGeminiApi(buildEnhancedAppearancePrompt(p, footwear), parts, quality, userKey)));
}

export async function generateUgcBackSeatFitCheck(baseModel: ImageFile, pantsImage: ImageFile, pantType: string, pantMaterial: string, topImage: ImageFile | null, topType: string | null, topMaterial: string | null, quality: QualityLevel, footwear: string | undefined, customInput: string | undefined, userKey?: string): Promise<string[]> {
    const parts = [{ inlineData: { mimeType: baseModel.mimeType, data: baseModel.base64 } }, { inlineData: { mimeType: pantsImage.mimeType, data: pantsImage.base64 } }];
    if (topImage) parts.push({ inlineData: { mimeType: topImage.mimeType, data: topImage.base64 } });
    const clothingDetails = `${pantType} (${pantMaterial})${topImage ? ` paired with ${topType} (${topMaterial})` : ''}`;

    const prompts = [
        `Female wearing ${clothingDetails}, back view standing naturally, showing seat area. ${parseCustomPrompt(customInput || '')}`,
        `Same person slight posture shift, subtle weight transfer. ${parseCustomPrompt(customInput || '')}`,
        `Same person settled back posture, realistic everyday back fit view. ${parseCustomPrompt(customInput || '')}`
    ];
    
    return Promise.all(prompts.map(p => callGeminiApi(buildEnhancedAppearancePrompt(p, footwear), parts, quality, userKey)));
}

export async function generateUgcHemCuffInteraction(baseModel: ImageFile, pantsImage: ImageFile, pantType: string, pantMaterial: string, topImage: ImageFile | null, topType: string | null, topMaterial: string | null, quality: QualityLevel, footwear: string | undefined, customInput: string | undefined, userKey?: string): Promise<string[]> {
    const parts = [{ inlineData: { mimeType: baseModel.mimeType, data: baseModel.base64 } }, { inlineData: { mimeType: pantsImage.mimeType, data: pantsImage.base64 } }];
    if (topImage) parts.push({ inlineData: { mimeType: topImage.mimeType, data: topImage.base64 } });
    const clothingDetails = `${pantType} (${pantMaterial})${topImage ? ` paired with ${topType} (${topMaterial})` : ''}`;

    const prompts = [
        `Female wearing ${clothingDetails}, standing still, hem clearly visible. ${parseCustomPrompt(customInput || '')}`,
        `Same person lifting heel or taking small step forward, showing hem movement. ${parseCustomPrompt(customInput || '')}`,
        `Same person standing relaxed again, hem resting naturally. ${parseCustomPrompt(customInput || '')}`
    ];
    
    return Promise.all(prompts.map(p => callGeminiApi(buildEnhancedAppearancePrompt(p, footwear), parts, quality, userKey)));
}

export async function generateUgcDailyMotionPause(baseModel: ImageFile, pantsImage: ImageFile, pantType: string, pantMaterial: string, topImage: ImageFile | null, topType: string | null, topMaterial: string | null, quality: QualityLevel, footwear: string | undefined, customInput: string | undefined, userKey?: string): Promise<string[]> {
    const parts = [{ inlineData: { mimeType: baseModel.mimeType, data: baseModel.base64 } }, { inlineData: { mimeType: pantsImage.mimeType, data: pantsImage.base64 } }];
    if (topImage) parts.push({ inlineData: { mimeType: topImage.mimeType, data: topImage.base64 } });
    const clothingDetails = `${pantType} (${pantMaterial})${topImage ? ` paired with ${topType} (${topMaterial})` : ''}`;

    const prompts = [
        `Female wearing ${clothingDetails}, mid-step walking pause, natural motion. ${parseCustomPrompt(customInput || '')}`,
        `Same person stopping movement, casual standing posture. ${parseCustomPrompt(customInput || '')}`,
        `Same person fully relaxed stance, authentic daily look. ${parseCustomPrompt(customInput || '')}`
    ];
    
    return Promise.all(prompts.map(p => callGeminiApi(buildEnhancedAppearancePrompt(p, footwear), parts, quality, userKey)));
}

// --- One Set Functions ---

export async function generateUgcFullSetBalance(baseModel: ImageFile, setelanImage: ImageFile, setelanType: string, material: string, quality: QualityLevel, footwear: string | undefined, customInput: string | undefined, userKey?: string): Promise<string[]> {
    const parts = [{ inlineData: { mimeType: baseModel.mimeType, data: baseModel.base64 } }, { inlineData: { mimeType: setelanImage.mimeType, data: setelanImage.base64 } }];
    const clothingDetails = `${setelanType} (${material})`;
    const prompts = [
        `Female wearing the one-set outfit ${clothingDetails}, full body front view, relaxed posture. ${parseCustomPrompt(customInput || '')}`,
        `Same person slight posture adjustment, showing balance of top and bottom pieces of the ${clothingDetails} set. ${parseCustomPrompt(customInput || '')}`,
        `Same person settled stance, natural everyday look wearing the ${clothingDetails} one-set. ${parseCustomPrompt(customInput || '')}`
    ];
    return Promise.all(prompts.map(p => callGeminiApi(buildEnhancedAppearancePrompt(p, footwear), parts, quality, userKey)));
}

export async function generateUgcTopBottomTransition(baseModel: ImageFile, setelanImage: ImageFile, setelanType: string, material: string, quality: QualityLevel, footwear: string | undefined, customInput: string | undefined, userKey?: string): Promise<string[]> {
    const parts = [{ inlineData: { mimeType: baseModel.mimeType, data: baseModel.base64 } }, { inlineData: { mimeType: setelanImage.mimeType, data: setelanImage.base64 } }];
    const clothingDetails = `${setelanType} (${material})`;
    const prompts = [
        `Female wearing the one-set outfit ${clothingDetails}, front view, neutral stance. ${parseCustomPrompt(customInput || '')}`,
        `Same person slight torso twist, showing clear transition and connection between top and bottom of the ${clothingDetails} set. ${parseCustomPrompt(customInput || '')}`,
        `Same person relaxed front stance again, balanced composition wearing ${clothingDetails}. ${parseCustomPrompt(customInput || '')}`
    ];
    return Promise.all(prompts.map(p => callGeminiApi(buildEnhancedAppearancePrompt(p, footwear), parts, quality, userKey)));
}

export async function generateUgcMovementHarmony(baseModel: ImageFile, setelanImage: ImageFile, setelanType: string, material: string, quality: QualityLevel, footwear: string | undefined, customInput: string | undefined, userKey?: string): Promise<string[]> {
    const parts = [{ inlineData: { mimeType: baseModel.mimeType, data: baseModel.base64 } }, { inlineData: { mimeType: setelanImage.mimeType, data: setelanImage.base64 } }];
    const clothingDetails = `${setelanType} (${material})`;
    const prompts = [
        `Female wearing the one-set outfit ${clothingDetails}, standing neutral, full body framing. ${parseCustomPrompt(customInput || '')}`,
        `Same person taking a small step forward, showing movement harmony of the ${clothingDetails} set pieces. ${parseCustomPrompt(customInput || '')}`,
        `Same person stopping naturally, the ${clothingDetails} outfit resting together. ${parseCustomPrompt(customInput || '')}`
    ];
    return Promise.all(prompts.map(p => callGeminiApi(buildEnhancedAppearancePrompt(p, footwear), parts, quality, userKey)));
}

export async function generateUgcCasualStyling(baseModel: ImageFile, setelanImage: ImageFile, setelanType: string, material: string, quality: QualityLevel, footwear: string | undefined, customInput: string | undefined, userKey?: string): Promise<string[]> {
    const parts = [{ inlineData: { mimeType: baseModel.mimeType, data: baseModel.base64 } }, { inlineData: { mimeType: setelanImage.mimeType, data: setelanImage.base64 } }];
    const clothingDetails = `${setelanType} (${material})`;
    const prompts = [
        `Female wearing the one-set outfit ${clothingDetails}, relaxed casual stance. ${parseCustomPrompt(customInput || '')}`,
        `Same person lightly adjusting top or waist area of the ${clothingDetails} set. ${parseCustomPrompt(customInput || '')}`,
        `Same person relaxed pose after adjustment, authentic UGC look in ${clothingDetails}. ${parseCustomPrompt(customInput || '')}`
    ];
    // Fixed parenthesis and arguments list for map callback
    return Promise.all(prompts.map(p => callGeminiApi(buildEnhancedAppearancePrompt(p, footwear), parts, quality, userKey)));
}

export async function generateUgcMirrorSetReview(baseModel: ImageFile, setelanImage: ImageFile, setelanType: string, material: string, quality: QualityLevel, footwear: string | undefined, customInput: string | undefined, userKey?: string): Promise<string[]> {
    const parts = [{ inlineData: { mimeType: baseModel.mimeType, data: baseModel.base64 } }, { inlineData: { mimeType: setelanImage.mimeType, data: setelanImage.base64 } }];
    const clothingDetails = `${setelanType} (${material})`;
    const prompts = [
        `Female wearing the one-set outfit ${clothingDetails}, mirror selfie full body, casual posture. ${parseCustomPrompt(customInput || '')}`,
        `Same person slight shift in mirror, handheld smartphone reflection visible, showing ${clothingDetails}. ${parseCustomPrompt(customInput || '')}`,
        `Same person relaxed mirror stance, natural everyday review of the ${clothingDetails} one-set. ${parseCustomPrompt(customInput || '')}`
    ];
    return Promise.all(prompts.map(p => callGeminiApi(buildEnhancedAppearancePrompt(p, footwear), parts, quality, userKey)));
}

// --- General Functions ---

export async function generateUgcPantsImages(baseModel: ImageFile, pantsImage: ImageFile, pantType: string, material: string, topImage: ImageFile | null, topType: string | null, topMaterial: string | null, isCinematic: boolean, quality: QualityLevel, angles: string[], bgPrompt: string | undefined, poses: string[], cameraPreset: string, footwear: string | undefined, accessory: string | undefined, faceAccessory: string | undefined, expressions: string[] | undefined, customInput: string | undefined, userKey?: string): Promise<string[]> {
    const parts = [
        { inlineData: { mimeType: baseModel.mimeType, data: baseModel.base64 } },
        { inlineData: { mimeType: pantsImage.mimeType, data: pantsImage.base64 } }
    ];
    if (topImage) parts.push({ inlineData: { mimeType: topImage.mimeType, data: topImage.base64 } });
    
    const clothingDetails = `Model wearing ${pantType} (${material})${topImage ? ` and ${topType} (${topMaterial})` : ''}`;
    const posePrompt = poses.length > 0 ? getPoseText(poses[0]) : '';
    let basePrompt = `Realistic UGC style photo, ${posePrompt}, wearing ${clothingDetails}. ${parseCustomPrompt(customInput || '')}`;
    if (bgPrompt) basePrompt += `. Background: ${bgPrompt}.`;
    
    const finalPrompt = buildEnhancedAppearancePrompt(basePrompt, footwear, accessory, faceAccessory);
    return [await callGeminiApi(finalPrompt, parts, quality, userKey)];
}

export async function generateUgcTopImages(baseModel: ImageFile, topImage: ImageFile, topType: string, material: string, pantsImage: ImageFile | null, pantType: string | null, pantMaterial: string | null, isCinematic: boolean, quality: QualityLevel, angles: string[], bgPrompt: string | undefined, poses: string[], cameraPreset: string, footwear: string | undefined, accessory: string | undefined, faceAccessory: string | undefined, expressions: string[] | undefined, customInput: string | undefined, userKey?: string): Promise<string[]> {
    const parts = [
        { inlineData: { mimeType: baseModel.mimeType, data: baseModel.base64 } },
        { inlineData: { mimeType: topImage.mimeType, data: topImage.base64 } }
    ];
    if (pantsImage) parts.push({ inlineData: { mimeType: pantsImage.mimeType, data: pantsImage.base64 } });
    
    const clothingDetails = `Model wearing ${topType} (${material})${pantsImage ? ` and ${pantType} (${pantMaterial})` : ''}`;
    const posePrompt = poses.length > 0 ? getPoseText(poses[0]) : '';
    let basePrompt = `Realistic UGC style photo, ${posePrompt}, wearing ${clothingDetails}. ${parseCustomPrompt(customInput || '')}`;
    if (bgPrompt) basePrompt += `. Background: ${bgPrompt}.`;
    
    const finalPrompt = buildEnhancedAppearancePrompt(basePrompt, footwear, accessory, faceAccessory);
    return [await callGeminiApi(finalPrompt, parts, quality, userKey)];
}

export async function generateUgcSetelanImages(baseModel: ImageFile, setelanImage: ImageFile, setelanType: string, material: string, quality: QualityLevel, bgPrompt: string | undefined, poses: string[], cameraPreset: string, footwear: string | undefined, accessory: string | undefined, faceAccessory: string | undefined, expressions: string[] | undefined, customInput: string | undefined, userKey?: string): Promise<string[]> {
    const parts = [{ inlineData: { mimeType: baseModel.mimeType, data: baseModel.base64 } }, { inlineData: { mimeType: setelanImage.mimeType, data: setelanImage.base64 } }];
    const clothingDetails = `Model wearing full outfit: ${setelanType} made of ${material}`;
    const posePrompt = poses.length > 0 ? getPoseText(poses[0]) : '';
    let basePrompt = `Realistic UGC style photo, ${posePrompt}, wearing ${clothingDetails}. ${parseCustomPrompt(customInput || '')}`;
    if (bgPrompt) basePrompt += `. Background: ${bgPrompt}.`;

    const finalPrompt = buildEnhancedAppearancePrompt(basePrompt, footwear, accessory, faceAccessory);
    return [await callGeminiApi(finalPrompt, parts, quality, userKey)];
}

export async function generateUgcCinematicImages(baseModel: ImageFile, productImage: ImageFile, prodType: string, prodMaterial: string, secondaryImage: ImageFile | null, secType: string | null, secMaterial: string | null, mode: 'pants' | 'top' | 'setelan', quality: QualityLevel, angles: string[], bgPrompt: string | undefined, poses: string[], cameraPreset: string, footwear: string | undefined, accessory: string | undefined, faceAccessory: string | undefined, expressions: string[] | undefined, customInput: string | undefined, userKey?: string): Promise<string[]> {
    const images: string[] = [];
    const loopAngles = angles.length > 0 ? angles : ['cine_full_body'];
    const loopPoses = poses.length > 0 ? poses : ['default'];

    for (const angleId of loopAngles) {
        for (const poseId of loopPoses) {
            const parts = [{ inlineData: { mimeType: baseModel.mimeType, data: baseModel.base64 } }, { inlineData: { mimeType: productImage.mimeType, data: productImage.base64 } }];
            if (secondaryImage) parts.push({ inlineData: { mimeType: secondaryImage.mimeType, data: secondaryImage.base64 } });
            
            const angleLabel = getAngleLabel(angleId, true);
            const poseText = poseId !== 'default' ? getPoseText(poseId) : 'standing naturally';
            const clothingDetails = `Model wearing ${prodType} (${prodMaterial})`;
            let basePrompt = `Cinematic film still, ${angleLabel}, ${poseText}, ${clothingDetails}. ${parseCustomPrompt(customInput || '')}`;
            if (bgPrompt) basePrompt += `. Location: ${bgPrompt}.`;
            
            const finalPrompt = buildEnhancedAppearancePrompt(basePrompt, footwear, accessory, faceAccessory);
            images.push(await callGeminiApi(finalPrompt, parts, quality, userKey));
        }
    }
    return images;
}

export async function generateBackgroundReplaceImage(bgPrompt: string, baseModel: ImageFile, pantsImage: ImageFile | null, topImage: ImageFile | null, pantsDetails: any, topDetails: any, setelanImage: ImageFile | null, setelanDetails: any, quality: QualityLevel, footwear: string | undefined, cameraPreset: string, customInput: string | undefined, userKey?: string): Promise<string> {
    const basePrompt = `Preserve the model and outfit exactly, but replace the background with: ${bgPrompt}. ${parseCustomPrompt(customInput || '')}`;
    const finalPrompt = buildEnhancedAppearancePrompt(basePrompt, footwear);
    
    const parts = [{ inlineData: { mimeType: baseModel.mimeType, data: baseModel.base64 } }];
    if (pantsImage) parts.push({ inlineData: { mimeType: pantsImage.mimeType, data: pantsImage.base64 } });
    if (topImage) parts.push({ inlineData: { mimeType: topImage.mimeType, data: topImage.base64 } });
    if (setelanImage) parts.push({ inlineData: { mimeType: setelanImage.mimeType, data: setelanImage.base64 } });
    return await callGeminiApi(finalPrompt, parts, quality, userKey);
}

export async function generateCustomImage(baseModel: ImageFile, prompt: string, quality: QualityLevel, userKey?: string): Promise<string> {
    const parts = [{ inlineData: { mimeType: baseModel.mimeType, data: baseModel.base64 } }];
    return await callGeminiApi(prompt, parts, quality, userKey);
}

export async function generateAutoVideoPrompt(contextDescription: string, userKey?: string): Promise<string> {
    const apiKey = userKey || process.env.API_KEY;
    if (!apiKey) return "Cinematic movement shot.";
    
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Write a cinematic text-to-video prompt for: "${contextDescription}". Focus on subtle realistic motion. Under 50 words. ONLY text.`;
    try {
        const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: { parts: [{ text: prompt }] } });
        return response.text || "Cinematic movement shot.";
    } catch (e) {
        return "Cinematic movement shot.";
    }
}
