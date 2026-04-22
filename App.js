// YourBody v2.1.0-Capacitor
// Trigger: 1
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
  Platform,
  useWindowDimensions,
  Alert,
  Image,
  TextInput,
  Switch,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================
// THEME
// ============================================================
const C = {
  bg: '#06081A', s: '#0F1332', sl: '#171D45', sh: '#1E2555', b: '#1E2555',
  t1: '#FFFFFF', t2: '#8B93B8', t3: '#5A6380',
  gold: '#FFD700', cyan: '#00E5FF', violet: '#A855F7', emerald: '#10B981',
  rose: '#F43F5E', amber: '#F59E0B', blue: '#3B82F6', pink: '#EC4899',
  teal: '#14B8A6', indigo: '#6366F1', orange: '#F97316',
};

// ============================================================
// DATA: Practical Actions & Interactive Content
// ============================================================

const getTimePhase = () => {
  const h = new Date().getHours();
  if (h >= 5 && h < 9) return { phase: 'Kebangkitan Pagi', color: C.amber, icon: '🌅', actions: [
    { icon: '☀️', title: 'Paparan Cahaya Matahari', desc: 'Keluar 10-15 menit tanpa kacamata hitam', duration: '15 min', actionType: 'timer', seconds: 900 },
    { icon: '💧', title: 'Minum Air Hangat + Lemon', desc: 'Hidrasi & aktifkan pencernaan', duration: '2 min', actionType: 'checklist' },
    { icon: '🧘', title: 'Stretching Pagi', desc: 'Buka fascia yang kaku setelah tidur', duration: '5 min', actionType: 'routine', routineId: 'morning-stretch' },
    { icon: '🫁', title: 'Breathing: Energize', desc: 'Napas Wim Hof — bangunkan tubuh', duration: '3 min', actionType: 'breathing', pattern: 'wimhof' },
  ]};
  if (h >= 9 && h < 12) return { phase: 'Performa Puncak', color: C.cyan, icon: '⚡', actions: [
    { icon: '🧠', title: 'Deep Work Session', desc: 'Kortisol optimal — kerjakan tugas paling sulit', duration: '90 min', actionType: 'timer', seconds: 5400 },
    { icon: '👆', title: 'Acupressure: Fokus', desc: 'Tekan GV20 (puncak kepala) untuk clarity', duration: '2 min', actionType: 'acupressure', pointId: 'gv20' },
    { icon: '💧', title: 'Hidrasi', desc: 'Minum air putih minimal 500ml', duration: '1 min', actionType: 'checklist' },
  ]};
  if (h >= 12 && h < 14) return { phase: 'Makan Siang', color: C.emerald, icon: '🥗', actions: [
    { icon: '🍽️', title: 'Makan Penuh Kesadaran', desc: 'Kunyah 20-30x per suapan, tanpa layar', duration: '20 min', actionType: 'timer', seconds: 1200 },
    { icon: '🚶', title: 'Jalan Kaki 10 Menit', desc: 'Aktivasi pencernaan & reset postur', duration: '10 min', actionType: 'timer', seconds: 600 },
    { icon: '👆', title: 'Acupressure: Pencernaan', desc: 'Tekan ST36 (bawah lutut) untuk pencernaan', duration: '2 min', actionType: 'acupressure', pointId: 'st36' },
  ]};
  if (h >= 14 && h < 17) return { phase: 'Aktivitas Fisik', color: C.orange, icon: '🏃', actions: [
    { icon: '💪', title: 'Olahraga / Gerakan', desc: 'Suhu tubuh tertinggi — perfect untuk exercise', duration: '30 min', actionType: 'timer', seconds: 1800 },
    { icon: '🧊', title: 'Cold Exposure', desc: 'Shower dingin untuk mitokondria & fokus', duration: '3 min', actionType: 'cold' },
    { icon: '🫁', title: 'Box Breathing Recovery', desc: 'Pulihkan setelah aktivitas dengan 4-4-4-4', duration: '4 min', actionType: 'breathing', pattern: 'box' },
  ]};
  if (h >= 17 && h < 20) return { phase: 'Golden Hour', color: '#FF8C69', icon: '🌆', actions: [
    { icon: '🍽️', title: 'Tutup Eating Window', desc: 'Makan terakhir 3 jam sebelum tidur', duration: '—', actionType: 'checklist' },
    { icon: '🌍', title: 'Grounding / Earthing', desc: 'Bertelanjang kaki di tanah/rumput', duration: '20 min', actionType: 'timer', seconds: 1200 },
    { icon: '🧘', title: 'Yoga Sore', desc: 'Forward folds & twists untuk relaksasi', duration: '10 min', actionType: 'routine', routineId: 'evening-yoga' },
  ]};
  if (h >= 20 && h < 22) return { phase: 'Persiapan Tidur', color: C.violet, icon: '🌙', actions: [
    { icon: '📱', title: 'Digital Sunset', desc: 'Matikan layar atau aktifkan night mode', duration: '—', actionType: 'checklist' },
    { icon: '🫁', title: 'Breathing: 4-7-8 Sleep', desc: 'Aktivasi parasimpatis untuk tidur dalam', duration: '5 min', actionType: 'breathing', pattern: '478' },
    { icon: '📝', title: 'Journaling Gratitude', desc: 'Tulis 3 hal yang disyukuri hari ini', duration: '5 min', actionType: 'timer', seconds: 300 },
    { icon: '🦶', title: 'Self-Massage Kaki', desc: 'Pijat telapak kaki 2 menit per sisi', duration: '4 min', actionType: 'timer', seconds: 240 },
  ]};
  return { phase: 'Regenerasi Dalam', color: '#6B21A8', icon: '💜', actions: [
    { icon: '😴', title: 'Tidur Berkualitas', desc: 'Ruangan gelap, sejuk (18-20°C), tenang', duration: '7-9 jam', actionType: 'checklist' },
    { icon: '🌙', title: 'Sleep Meditation', desc: 'Body scan untuk relaksasi total', duration: '10 min', actionType: 'bodyscan' },
  ]};
};

const BREATHING_PATTERNS = {
  vagus: { name: 'Vagus Nerve (4-4-8)', desc: 'Menenangkan. Aktifkan parasimpatis.', phases: [
    { label: 'Tarik Napas', duration: 4, color: C.cyan },
    { label: 'Tahan', duration: 4, color: C.amber },
    { label: 'Buang Pelan', duration: 8, color: C.violet },
  ], cycles: 6, image: require('./assets/breathing_vagus.png') },
  '478': { name: 'Sleep Breathing (4-7-8)', desc: 'Paling efektif untuk insomnia.', phases: [
    { label: 'Tarik Napas', duration: 4, color: C.cyan },
    { label: 'Tahan', duration: 7, color: C.amber },
    { label: 'Buang Pelan', duration: 8, color: C.violet },
  ], cycles: 4, image: require('./assets/breathing_478.png') },
  box: { name: 'Box Breathing (4-4-4-4)', desc: 'Keseimbangan & fokus. Dipakai Navy SEALs.', phases: [
    { label: 'Tarik Napas', duration: 4, color: C.cyan },
    { label: 'Tahan', duration: 4, color: C.amber },
    { label: 'Buang', duration: 4, color: C.violet },
    { label: 'Tahan Kosong', duration: 4, color: C.rose },
  ], cycles: 6, image: require('./assets/breathing_box.png') },
  wimhof: { name: 'Wim Hof Power', desc: 'Energi & imunitas. 30 napas cepat + tahan.', phases: [
    { label: 'Napas Cepat (30x)', duration: 60, color: C.orange },
    { label: 'Tahan Buang', duration: 30, color: C.rose },
    { label: 'Recovery Breath', duration: 15, color: C.emerald },
  ], cycles: 3, image: require('./assets/breathing_wimhof.png') },
  coherence: { name: 'Heart Coherence (5-5)', desc: 'Sinkronkan jantung & otak.', phases: [
    { label: 'Tarik Napas', duration: 5, color: C.cyan },
    { label: 'Buang Pelan', duration: 5, color: C.violet },
  ], cycles: 12, image: require('./assets/breathing_coherence.png') },
};

const AI_PROVIDERS = {
  sumopod: {
    name: 'SumoPod',
    baseUrl: 'https://ai.sumopod.com/v1',
    models: [
      'gpt-4o-mini', 'gpt-4o', 'deepseek-chat', 'claude-3-haiku', 
      'mimo-v2-pro', 'mimo-v2-flash', 'mimo-v2-omni'
    ]
  },
  openrouter: {
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    models: [
      'openrouter/free', 'google/gemini-2.0-flash-001', 'anthropic/claude-3-haiku', 
      'mistralai/mistral-7b-instruct', 'meta-llama/llama-3-8b-instruct'
    ]
  }
};

const BODY_SCAN_STEPS = [
  { area: 'Kaki & Telapak Kaki', instruction: 'Rasakan berat kaki di lantai. Rilekskan setiap jari. Rasakan energi bumi naik melalui telapak kaki.', duration: 45, image: require('./assets/body_scan_feet.png'), posisi: 'Berbaring Rileks' },
  { area: 'Betis & Lutut', instruction: 'Lepaskan ketegangan di betis. Biarkan lutut rileks. Rasakan darah mengalir bebas.', duration: 30, image: require('./assets/body_scan_calves.png'), posisi: 'Berbaring Rileks' },
  { area: 'Paha & Pinggul', instruction: 'Area psoas — tempat trauma tersimpan. Tarik napas dalam, bayangkan rileksasi mengalir ke pinggul.', duration: 45, image: require('./assets/body_scan_hips.png'), posisi: 'Berbaring Rileks' },
  { area: 'Perut & Solar Plexus', instruction: 'Pusat "gut feeling" Anda. Rasakan perut mengembang & mengempis. Lepaskan kecemasan.', duration: 45, image: require('./assets/body_scan_gut.png'), posisi: 'Berbaring Rileks' },
  { area: 'Dada & Jantung', instruction: 'Rasakan detak jantung. Bayangkan cahaya hijau hangat di dada. Biarkan kasih sayang mengalir.', duration: 45, image: require('./assets/body_scan_heart.png'), posisi: 'Berbaring Rileks' },
  { area: 'Bahu & Lengan', instruction: 'Turunkan bahu jauh dari telinga. Rilekskan lengan hingga ujung jari. Lepaskan beban.', duration: 30, image: require('./assets/body_scan_shoulders.png'), posisi: 'Berbaring Rileks' },
  { area: 'Leher & Tenggorokan', instruction: 'Area komunikasi. Rilekskan rahang. Biarkan lidah turun dari langit mulut.', duration: 30, image: require('./assets/body_scan_neck.png'), posisi: 'Berbaring Rileks' },
  { area: 'Wajah & Kepala', instruction: 'Rilekskan dahi, mata, pipi, rahang. Bayangkan cahaya putih di kelenjar pineal (pusat kepala).', duration: 45, image: require('./assets/body_scan_face.png'), posisi: 'Berbaring Rileks' },
  { area: 'Seluruh Tubuh', instruction: 'Rasakan seluruh tubuh sebagai satu kesatuan cahaya. Anda utuh, aman, dan hidup.', duration: 45, image: require('./assets/body_scan_fullbody.png'), posisi: 'Berbaring Rileks' },
];

const STRETCH_ROUTINES = {
  'morning-stretch': { name: 'Stretch Pagi (5 min)', image: require('./assets/yoga_banner_premium.png'), steps: [
    { name: 'Cat-Cow', instruction: 'Posisi merangkak. Tarik napas: lengkungkan punggung ke bawah. Buang: bulatkan punggung ke atas. Gerak mengalir.', duration: 45, image: require('./assets/pose_cat_cow.png') },
    { name: 'Child Pose', instruction: 'Duduk ke tumit, tangan lurus ke depan di lantai. Bernapas dalam. Rasakan peregangan di punggung.', duration: 30, image: require('./assets/pose_child_pose.png') },
    { name: 'Downward Dog', instruction: 'Angkat pinggul tinggi, tekan tumit ke lantai. Kaki selebar bahu. Tahan & bernapas.', duration: 30, image: require('./assets/pose_downward_dog.png') },
    { name: 'Forward Fold', instruction: 'Berdiri, lipat badan ke depan dari pinggul. Biarkan kepala menggantung. Rilekskan leher.', duration: 30, image: require('./assets/pose_forward_fold.png') },
    { name: 'Spinal Twist', instruction: 'Berbaring, tekuk satu lutut ke sisi sebelah. Tangan terbuka. Tahan 20 detik per sisi.', duration: 40, image: require('./assets/pose_spinal_twist.png') },
    { name: 'Neck Circles', instruction: 'Putar kepala perlahan searah jarum jam 5x, lalu berlawanan 5x. Pelan dan mindful.', duration: 30, image: require('./assets/pose_neck_circles.png') },
  ]},
  'evening-yoga': { name: 'Yoga Malam (10 min)', image: require('./assets/yoga_banner_premium.png'), steps: [
    { name: 'Legs Up The Wall', instruction: 'Berbaring, kedua kaki naik ke dinding. Tangan di samping. Bernapas pelan 2 menit.', duration: 120, image: require('./assets/pose_legs_up_wall.png') },
    { name: 'Supine Twist', instruction: 'Berbaring, tekuk lutut ke satu sisi. Rasakan pelepasan di punggung bawah. 1 menit per sisi.', duration: 120, image: require('./assets/pose_supine_twist.png') },
    { name: 'Happy Baby', instruction: 'Berbaring, pegang telapak kaki dari dalam. Goyangkan pelan. Buka pinggul.', duration: 60, image: require('./assets/pose_happy_baby.png') },
    { name: 'Pigeon Pose', instruction: 'Satu kaki ke depan tertekuk, satu ke belakang lurus. Turunkan badan. 1 menit per sisi.', duration: 120, image: require('./assets/pose_pigeon_pose.png') },
    { name: 'Savasana', instruction: 'Berbaring total. Lepaskan semua usaha. Serahkan berat tubuh ke lantai. Hanya bernapas.', duration: 120, image: require('./assets/pose_savasana.png') },
  ]},
  'fascia-release': { name: 'Fascia Release (8 min)', image: require('./assets/yoga_banner_premium.png'), steps: [
    { name: 'Jaw Release', instruction: 'Buka mulut lebar, gerakkan rahang ke kiri-kanan. Pijat sendi rahang melingkar, 30 detik per sisi.', duration: 60, image: require('./assets/pose_jaw_release.png') },
    { name: 'Neck Fascia', instruction: 'Miringkan kepala ke satu sisi, tahan 30 detik. Tangan sisi lain menggantung untuk menambah tarikan. Kedua sisi.', duration: 60, image: require('./assets/pose_neck_fascia.png') },
    { name: 'Shoulder Rolls', instruction: 'Putar bahu perlahan ke belakang 10x, ke depan 10x. Besar dan lambat.', duration: 45, image: require('./assets/pose_shoulder_rolls.png') },
    { name: 'Thoracic Opener', instruction: 'Tangan di belakang kepala, siku terbuka. Tarik napas & buka dada. Buang & tutup siku. 10x.', duration: 60, image: require('./assets/pose_thoracic_opener.png') },
    { name: 'Hip Circles', instruction: 'Berdiri, putar pinggul melingkar besar. 10x per arah. Minyaki sendi pinggul.', duration: 45 },
    { name: 'Psoas Release', instruction: 'Berbaring, lutut ditekuk, kaki di lantai. Biarkan lutut jatuh perlahan ke satu sisi. 45 detik per sisi.', duration: 90 },
    { name: 'Foot Roll', instruction: 'Pijak bola tenis. Gulingkan di bawah telapak kaki pelan. 30 detik per kaki.', duration: 60 },
  ]},
};

const ACUPRESSURE_POINTS = [
  { id: 'li4', name: 'Hegu (LI4)', location: 'Antara ibu jari & telunjuk, di otot', benefit: 'Sakit kepala, stres, imunitas, nyeri gigi', instruction: 'Tekan kuat dengan ibu jari tangan lain. Pijat melingkar. Bernapas dalam.', duration: 120, icon: '✋', macroImage: require('./assets/acu_li4_hegu_macro.png') },
  { id: 'pc6', name: 'Neiguan (PC6)', location: '3 jari di atas pergelangan dalam', benefit: 'Mual, kecemasan, jantung, insomnia', instruction: 'Tekan dengan 2 jari. Tekanan sedang. Bernapas lambat. Rasakan ketenangan.', duration: 120, icon: '🤚', macroImage: require('./assets/acu_pc6_neiguan_macro.png') },
  { id: 'st36', name: 'Zusanli (ST36)', location: '4 jari di bawah lutut, sisi luar tulang kering', benefit: 'Energi, pencernaan, imunitas, anti-aging', instruction: 'Titik "longevity" paling terkenal. Tekan kuat, pijat melingkar. Hangat di area = berhasil.', duration: 120, icon: '🦵', macroImage: require('./assets/acu_st36_zusanli_macro.png') },
  { id: 'gv20', name: 'Baihui (GV20)', location: 'Puncak kepala (garis tengah)', benefit: 'Fokus, clarity mental, ketenangan, headache', instruction: 'Tekan ringan dengan ujung jari. Bayangkan energi naik dari tulang belakang ke titik ini.', duration: 90, icon: '👆', macroImage: require('./assets/acu_gv20_baihui_macro.png') },
  { id: 'yin', name: 'Yintang (EX-HN3)', location: 'Titik tepat antara kedua alis', benefit: 'Insomnia, kecemasan, aktivasi pineal', instruction: 'Tekan ringan dengan jari tengah. Tutup mata. Fokuskan perhatian ke titik ini. Bernapas pelan.', duration: 120, icon: '🔮', macroImage: require('./assets/acu_yintang_macro_zoomed.png') },
  { id: 'kd1', name: 'Yongquan (KD1)', location: 'Cekungan di telapak kaki depan', benefit: 'Grounding, insomnia, hipertensi, kecemasan', instruction: 'Pijat kuat dengan ibu jari. Melingkar. Ini titik "grounding" — koneksi bumi.', duration: 90, icon: '🦶', macroImage: require('./assets/acu_kd1_yongquan_macro.png') },
  { id: 'gb20', name: 'Fengchi (GB20)', location: 'Dasar tengkorak, cekungan di kedua sisi leher', benefit: 'Migrain, kaku leher, flu, vertigo, mata lelah', instruction: 'Tekan kedua titik dengan ibu jari, jari lain merangkul kepala. Tekan ke atas & ke dalam. Tahan 2 menit.', duration: 120, icon: '🧠', macroImage: require('./assets/acu_gb20_fengchi_macro.png') },
  { id: 'gb21', name: 'Jianjing (GB21)', location: 'Tengah antara leher & ujung bahu', benefit: 'Nyeri bahu, leher kaku, sakit kepala tegang, stres', instruction: 'Cubit/tekan otot trapezius dengan ibu jari & telunjuk. Tahan kuat. JANGAN pada ibu hamil!', duration: 90, icon: '💪', macroImage: require('./assets/acu_gb21_jianjing_macro.png') },
  { id: 'lv3', name: 'Taichong (LV3)', location: 'Punggung kaki, antara tulang jari 1 & 2', benefit: 'Hipertensi, stres, sakit kepala, insomnia, mata merah', instruction: 'Tekan kuat di cekungan antara tulang. Pijat melingkar. Titik "Great Rushing" untuk meredakan hati.', duration: 120, icon: '🦶', macroImage: require('./assets/acu_lv3_taichong_macro.png') },
  { id: 'sp6', name: 'Sanyinjiao (SP6)', location: '4 jari di atas mata kaki dalam, belakang tulang kering', benefit: 'Nyeri haid, hormonal, pencernaan, insomnia, fertilitas', instruction: 'Tekan kuat di belakang tulang kering. Pijat melingkar. Titik pertemuan 3 meridian Yin. JANGAN pada ibu hamil!', duration: 120, icon: '🦵', macroImage: require('./assets/acu_sp6_sanyinjiao_macro.png') },
  { id: 'ht7', name: 'Shenmen (HT7)', location: 'Sisi kelingking pergelangan tangan, di lipatan', benefit: 'Insomnia, kecemasan, palpitasi, stres emosional', instruction: 'Tekan ringan dengan ibu jari. Rasakan denyut. Ini "Gerbang Roh" — titik penenang jiwa. Bernapas pelan.', duration: 120, icon: '✋', macroImage: require('./assets/acu_ht7_shenmen_macro.png') },
  { id: 'lu7', name: 'Lieque (LU7)', location: '2 jari di atas pergelangan, sisi ibu jari', benefit: 'Batuk, asma, sesak, flu, sakit tenggorokan, sakit kepala', instruction: 'Tekan di cekungan tulang radius. Pijat melingkar. Titik komando untuk kepala & leher.', duration: 90, icon: '🤚' },
];

// ============================================================
// SEFT (Spiritual Emotional Freedom Technique)
// ============================================================

const SEFT_TAPPING_POINTS = [
  { id: 1, name: 'Crown (CR)', location: 'Puncak kepala — ubun-ubun', instruction: 'Ketuk ringan di puncak kepala dengan 4 jari.', icon: '👆', macroImage: require('./assets/seft_crown_macro_zoomed.png') },
  { id: 2, name: 'Eyebrow (EB)', location: 'Pangkal alis mata (dekat hidung)', instruction: 'Ketuk di awal alis, di atas tulang orbital.', icon: '👁️', macroImage: require('./assets/seft_eyebrow_macro_detail.png') },
  { id: 3, name: 'Side of Eye (SE)', location: 'Tulang di samping luar mata', instruction: 'Ketuk di tulang samping mata, bukan di pelipis.', icon: '👁️', macroImage: require('./assets/seft_side_eye_macro_zoomed.png') },
  { id: 4, name: 'Under Eye (UE)', location: '2 cm di bawah mata, di tulang pipi', instruction: 'Ketuk di tulang di bawah mata, lurus dari pupil.', icon: '👁️', macroImage: require('./assets/seft_under_eye_macro_zoomed.png') },
  { id: 5, name: 'Under Nose (UN)', location: 'Antara hidung dan bibir atas', instruction: 'Ketuk di titik tengah antara hidung dan bibir atas.', icon: '👃', macroImage: require('./assets/seft_under_nose_macro_zoomed.png') },
  { id: 6, name: 'Chin (CH)', location: 'Lekukan antara dagu dan bibir bawah', instruction: 'Ketuk di cekungan di bawah bibir bawah.', icon: '👄', macroImage: require('./assets/seft_chin_macro_zoomed.png') },
  { id: 7, name: 'Collarbone (CB)', location: 'Pertemuan tulang dada, selangka & rusuk pertama', instruction: 'Ketuk di titik pertemuan tulang dada & selangka, agak ke bawah.', icon: '🦴', macroImage: require('./assets/seft_collarbone_macro_zoomed.png') },
  { id: 8, name: 'Under Arm (UA)', location: '10 cm di bawah ketiak (±setinggi puting pada pria)', instruction: 'Ketuk di sisi badan, sekitar 10 cm di bawah ketiak.', icon: '💪', macroImage: require('./assets/seft_under_arm_macro_zoomed.png') },
  { id: 9, name: 'Gamut Spot', location: 'Punggung tangan, antara tulang jari manis & kelingking', instruction: 'Ketuk terus-menerus di titik ini selama 9 Gamut Procedure.', icon: '✊', macroImage: require('./assets/seft_gamut_spot_macro_zoomed.png') },
  { id: 10, name: 'Inside Hand (IH)', location: 'Bagian dalam tangan / telapak tangan', instruction: 'Ketuk di bagian tengah telapak tangan.', icon: '🤲', macroImage: require('./assets/seft_inside_hand_macro_zoomed.png') },
  { id: 11, name: 'Thumb (TH)', location: 'Sisi luar kuku ibu jari', instruction: 'Ketuk di samping kuku ibu jari, sisi yang menghadap telunjuk.', icon: '👍', macroImage: require('./assets/seft_thumb_macro_zoomed.png') },
  { id: 12, name: 'Index Finger (IF)', location: 'Sisi luar kuku telunjuk', instruction: 'Ketuk di samping kuku telunjuk, sisi menghadap ibu jari.', icon: '☝️', macroImage: require('./assets/seft_index_finger_macro_zoomed.png') },
  { id: 13, name: 'Middle Finger (MF)', location: 'Sisi luar kuku jari tengah', instruction: 'Ketuk di samping kuku jari tengah.', icon: '🖐️', macroImage: require('./assets/seft_middle_finger_macro_zoomed.png') },
  { id: 14, name: 'Ring Finger (RF)', location: 'Sisi luar kuku jari manis', instruction: 'Ketuk di samping kuku jari manis.', icon: '🖐️', macroImage: require('./assets/seft_ring_finger_macro_zoomed.png') },
  { id: 15, name: 'Baby Finger (BF)', location: 'Sisi luar kuku kelingking', instruction: 'Ketuk di samping kuku kelingking.', icon: '🖐️', macroImage: require('./assets/seft_baby_finger_macro_zoomed.png') },
  { id: 16, name: 'Karate Chop (KC)', location: 'Sisi luar telapak tangan (untuk memotong)', instruction: 'Ketuk sisi telapak tangan yang digunakan untuk karate chop.', icon: '🤚', macroImage: require('./assets/seft_karate_chop_macro_zoomed.png') },
  { id: 17, name: 'Sore Spot', location: 'Dada atas kiri/kanan yang terasa nyeri jika ditekan', instruction: 'Usap melingkar (bukan ketuk) di area ini sambil ucapkan set-up.', icon: '💗', macroImage: require('./assets/seft_sore_spot_macro_zoomed.png') },
  { id: 18, name: 'Liver Point (LP)', location: 'Di bawah dada kanan, 2 rusuk di bawah puting', instruction: 'Ketuk ringan di area ini.', icon: '🫁', macroImage: require('./assets/seft_liver_point_macro_zoomed.png') },
];

const SEFT_9_GAMUT = [
  { step: 1, instruction: 'Tutup mata', duration: 3 },
  { step: 2, instruction: 'Buka mata', duration: 3 },
  { step: 3, instruction: 'Gerakkan mata ke kanan bawah dengan kuat', duration: 3 },
  { step: 4, instruction: 'Gerakkan mata ke kiri bawah dengan kuat', duration: 3 },
  { step: 5, instruction: 'Putar bola mata searah jarum jam (1 putaran penuh)', duration: 5 },
  { step: 6, instruction: 'Putar bola mata berlawanan jarum jam (1 putaran penuh)', duration: 5 },
  { step: 7, instruction: 'Bersenandung/bergumam berirama selama 2 detik', duration: 4 },
  { step: 8, instruction: 'Hitung dengan keras: 1... 2... 3... 4... 5...', duration: 5 },
  { step: 9, instruction: 'Bersenandung/bergumam kembali selama 2 detik', duration: 4 },
];

const SEFT_PROBLEMS = [
  { id: 'anxiety', icon: '😰', label: 'Kecemasan / Anxiety' },
  { id: 'sadness', icon: '😢', label: 'Kesedihan / Sedih' },
  { id: 'anger', icon: '😤', label: 'Kemarahan / Marah' },
  { id: 'fear', icon: '😨', label: 'Ketakutan / Takut' },
  { id: 'pain', icon: '🤕', label: 'Nyeri Fisik / Sakit' },
  { id: 'trauma', icon: '💔', label: 'Trauma / Luka Batin' },
  { id: 'insomnia', icon: '😴', label: 'Sulit Tidur / Insomnia' },
  { id: 'lowconf', icon: '😞', label: 'Kurang Percaya Diri' },
  { id: 'addiction', icon: '🔗', label: 'Kebiasaan Buruk / Adiksi' },
  { id: 'phobia', icon: '🕷️', label: 'Fobia / Ketakutan Spesifik' },
  { id: 'grief', icon: '🕊️', label: 'Duka / Kehilangan' },
  { id: 'stress', icon: '🧠', label: 'Stres Berat' },
  { id: 'custom', icon: '✏️', label: 'Masalah Lain (custom)' },
];

// ============================================================
// AKUPRESUR BERDASARKAN PENYAKIT / GANGGUAN
// ============================================================

const DISEASE_ACUPRESSURE = [
  { id: 'headache', icon: '🤯', name: 'Sakit Kepala & Migrain', desc: 'Nyeri kepala tegang, migrain, pusing',
    points: [
      { name: 'LI4 (Hegu)', location: 'Antara ibu jari & telunjuk', technique: 'Tekan kuat, pijat melingkar 2 menit per tangan. UTAMA untuk sakit kepala.', duration: 120, macroImage: require('./assets/acu_li4_hegu_macro.png') },
      { name: 'GB20 (Fengchi)', location: 'Dasar tengkorak, cekungan samping leher', technique: 'Tekan kedua titik dengan ibu jari ke atas & ke dalam. Tahan 2 menit.', duration: 120, macroImage: require('./assets/acu_gb20_fengchi_macro.png') },
      { name: 'Yintang', location: 'Antara kedua alis', technique: 'Tekan ringan dengan jari tengah. Tutup mata. Bernapas dalam.', duration: 90, macroImage: require('./assets/acu_yintang_macro_zoomed.png') },
      { name: 'GB21 (Jianjing)', location: 'Puncak bahu, tengah antara leher & ujung bahu', technique: 'Cubit otot bahu. Lepaskan ketegangan. Jangan pada ibu hamil.', duration: 90, macroImage: require('./assets/acu_gb21_jianjing_macro.png') },
    ], totalDuration: '8-10 menit', evidence: 'Meta-analisis BMJ 2017: akupresur efektif mengurangi intensitas sakit kepala 30-50%.' },
  { id: 'insomnia', icon: '😴', name: 'Insomnia & Gangguan Tidur', desc: 'Sulit tidur, sering terbangun, tidur tidak nyenyak',
    points: [
      { name: 'HT7 (Shenmen)', location: 'Sisi kelingking pergelangan tangan', technique: 'Tekan ringan, rasakan denyut. "Gerbang Roh" — titik penenang jiwa. 2 menit per tangan.', duration: 120, macroImage: require('./assets/acu_ht7_shenmen_macro.png') },
      { name: 'Yintang', location: 'Antara kedua alis', technique: 'Tekan ringan, tutup mata, fokus pada kegelapan di balik kelopak. 2 menit.', duration: 120, macroImage: require('./assets/acu_yintang_macro_zoomed.png') },
      { name: 'An Mian', location: 'Belakang daun telinga, cekungan di dasar tengkorak', technique: 'Tekan ringan kedua sisi. "Tidur Tenang" — nama titik ini. 2 menit.', duration: 120, macroImage: require('./assets/acu_an_mian_macro.png') },
      { name: 'KD1 (Yongquan)', location: 'Cekungan telapak kaki depan', technique: 'Pijat kuat melingkar. Tarik energi ke bawah = tidur lebih mudah. 2 menit per kaki.', duration: 120, macroImage: require('./assets/acu_kd1_yongquan_macro.png') },
      { name: 'SP6 (Sanyinjiao)', location: '4 jari di atas mata kaki dalam', technique: 'Tekan kuat di belakang tulang kering. Bukan untuk ibu hamil! 1 menit per kaki.', duration: 60, macroImage: require('./assets/acu_sp6_sanyinjiao_macro.png') },
    ], totalDuration: '10-12 menit', evidence: 'Studi J Clinical Nursing 2019: akupresur meningkatkan kualitas tidur setara dengan obat tidur ringan.' },
  { id: 'anxiety', icon: '😰', name: 'Kecemasan & Stres', desc: 'Cemas berlebihan, gelisah, panik, overthinking',
    points: [
      { name: 'PC6 (Neiguan)', location: '3 jari di atas pergelangan tangan dalam', technique: 'Tekan di antara 2 tendon. "Inner Gate" — gerbang ketenangan. 2 menit per tangan.', duration: 120, macroImage: require('./assets/acu_pc6_neiguan_macro.png') },
      { name: 'HT7 (Shenmen)', location: 'Sisi kelingking pergelangan tangan', technique: 'Tekan lembut, bernapas pelan. Menenangkan jantung & pikiran. 2 menit.', duration: 120, macroImage: require('./assets/acu_ht7_shenmen_macro.png') },
      { name: 'Yintang', location: 'Antara kedua alis ("Mata Ketiga")', technique: 'Tekan ringan, tutup mata. Bayangkan cahaya biru menenangkan. 2 menit.', duration: 120, macroImage: require('./assets/acu_yintang_macro_zoomed.png') },
      { name: 'GV20 (Baihui)', location: 'Puncak kepala', technique: 'Tekan ringan. "Seratus Pertemuan" — menyeimbangkan semua meridian. 1 menit.', duration: 60, macroImage: require('./assets/acu_gv20_baihui_macro.png') },
      { name: 'LV3 (Taichong)', location: 'Punggung kaki, antara tulang jari 1 & 2', technique: 'Tekan kuat. Meredakan hati & emosi. 1 menit per kaki.', duration: 60, macroImage: require('./assets/acu_lv3_taichong_macro.png') },
    ], totalDuration: '10 menit', evidence: 'RCT Frontiers in Psychology 2020: akupresur menurunkan skor kecemasan 40% pada mahasiswa.' },
  { id: 'backpain', icon: '🔙', name: 'Nyeri Punggung & Pinggang', desc: 'Nyeri punggung bawah, pinggang kaku, sciatica',
    points: [
      { name: 'UB40 (Weizhong)', location: 'Tepat di tengah lipatan belakang lutut', technique: 'Tekan kuat saat duduk/berbaring. "Command Point" untuk punggung. 2 menit per kaki.', duration: 120, macroImage: require('./assets/acu_ub40_weizhong_macro.png') },
      { name: 'UB23 (Shenshu)', location: 'Punggung bawah, 2 jari dari tulang belakang, setinggi pinggang', technique: 'Gunakan bola tenis di lantai: berbaring di atas bola, tekanan pada titik. 3 menit.', duration: 180, macroImage: require('./assets/acu_ub23_shenshu_macro.png') },
      { name: 'GB30 (Huantiao)', location: 'Bokong, 1/3 jarak dari tulang ekor ke tulang pinggul', technique: 'Tekan kuat dengan kepalan/bola tenis. Efektif untuk sciatica. 2 menit per sisi.', duration: 120 },
      { name: 'GV4 (Mingmen)', location: 'Tulang belakang setinggi pusar, di garis tengah', technique: 'Gosok kedua telapak tangan sampai panas, tempelkan di titik ini. 2 menit.', duration: 120, macroImage: require('./assets/acu_gv4_mingmen_macro.png') },
    ], totalDuration: '10-12 menit', evidence: 'Cochrane Review 2019: akupresur efektif sebagai terapi tambahan untuk nyeri punggung kronis.' },
  { id: 'digestion', icon: '🤢', name: 'Gangguan Pencernaan', desc: 'Mual, kembung, sembelit, maag, diare',
    points: [
      { name: 'ST36 (Zusanli)', location: '4 jari di bawah lutut, sisi luar tulang kering', technique: 'Tekan kuat, pijat melingkar. Titik #1 untuk SEMUA masalah pencernaan. 2 menit per kaki.', duration: 120, macroImage: require('./assets/acu_st36_zusanli_macro.png') },
      { name: 'PC6 (Neiguan)', location: '3 jari di atas pergelangan dalam', technique: 'Anti-mual paling efektif. Digunakan di rumah sakit post-operasi. 2 menit per tangan.', duration: 120, macroImage: require('./assets/acu_pc6_neiguan_macro.png') },
      { name: 'CV12 (Zhongwan)', location: 'Garis tengah perut, tengah antara pusar & tulang dada', technique: 'Tekan ringan melingkar searah jarum jam. Jangan tekan keras! 2 menit.', duration: 120, macroImage: require('./assets/acu_cv12_zhongwan_macro.png') },
      { name: 'SP4 (Gongsun)', location: 'Sisi dalam kaki, di cekungan di bawah tulang metatarsal 1', technique: 'Tekan kuat dengan ibu jari. Mengatur limpa & lambung. 1 menit per kaki.', duration: 60, macroImage: require('./assets/acu_sp4_gongsun_macro.png') },
    ], totalDuration: '8-10 menit', evidence: 'Studi Acta Obstet Gynecol Scand: PC6 mengurangi mual 70% vs plasebo.' },
  { id: 'shoulder', icon: '💪', name: 'Nyeri Bahu & Leher', desc: 'Bahu kaku, leher tegang, frozen shoulder',
    points: [
      { name: 'GB21 (Jianjing)', location: 'Puncak bahu, tengah leher-bahu', technique: 'Cubit kuat otot trapezius 30 detik, lepas, ulangi 5x per sisi. JANGAN pada ibu hamil!', duration: 90 },
      { name: 'GB20 (Fengchi)', location: 'Dasar tengkorak, cekungan samping leher', technique: 'Tekan ke atas dengan ibu jari. Putar kepala pelan sambil ditekan. 2 menit.', duration: 120 },
      { name: 'SI3 (Houxi)', location: 'Sisi luar tangan, di ujung lipatan saat mengepal', technique: 'Tekan kuat. Titik komando untuk leher & tulang belakang bagian atas. 1 menit per tangan.', duration: 60, macroImage: require('./assets/acu_si3_houxi_macro.png') },
      { name: 'LI4 (Hegu)', location: 'Antara ibu jari & telunjuk', technique: 'Tekan kuat. Melancarkan Qi ke seluruh tubuh bagian atas. 2 menit per tangan.', duration: 120, macroImage: require('./assets/acu_li4_hegu_macro.png') },
    ], totalDuration: '8-10 menit', evidence: 'Studi Pain Medicine 2018: akupresur + stretching menurunkan nyeri bahu 55%.' },
  { id: 'menstrual', icon: '🩸', name: 'Nyeri Haid & Hormonal', desc: 'Kram menstruasi, PMS, ketidakteraturan siklus',
    points: [
      { name: 'SP6 (Sanyinjiao)', location: '4 jari di atas mata kaki dalam', technique: 'Tekan kuat 2 menit per kaki. Titik pertemuan 3 meridian Yin — hormonal balance. JANGAN saat hamil!', duration: 120, macroImage: require('./assets/acu_sp6_sanyinjiao_macro.png') },
      { name: 'LV3 (Taichong)', location: 'Punggung kaki, antara tulang jari 1 & 2', technique: 'Tekan kuat. Melancarkan aliran Qi hati — mengatur emosi & hormon. 2 menit per kaki.', duration: 120, macroImage: require('./assets/acu_lv3_taichong_macro.png') },
      { name: 'CV4 (Guanyuan)', location: '4 jari di bawah pusar, garis tengah', technique: 'Letakkan telapak tangan yang sudah digosok hangat. Tekan ringan, napas dalam. 3 menit.', duration: 180, macroImage: require('./assets/acu_cv4_guanyuan_macro.png') },
      { name: 'ST36 (Zusanli)', location: '4 jari di bawah lutut, sisi luar', technique: 'Tekan kuat, pijat. Menguatkan energi & mengurangi kram. 1 menit per kaki.', duration: 60, macroImage: require('./assets/acu_st36_zusanli_macro.png') },
    ], totalDuration: '10-12 menit', evidence: 'Studi J Obstet Gynecol 2019: akupresur SP6 mengurangi nyeri haid setara ibuprofen.' },
  { id: 'eyestrain', icon: '👀', name: 'Mata Lelah & Tegang', desc: 'Mata kering, silau, lelah akibat layar, mata kabur',
    points: [
      { name: 'B2 (Zanzhu)', location: 'Cekungan di pangkal alis dekat hidung', technique: 'Tekan ke atas dengan ibu jari. "Drilling Bamboo" — titik utama mata. 1 menit.', duration: 60, macroImage: require('./assets/acu_b2_zanzhu_macro.png') },
      { name: 'Yintang', location: 'Antara kedua alis', technique: 'Tekan ringan, tutup mata. Rilekskan otot mata. 1 menit.', duration: 60, macroImage: require('./assets/acu_yintang_macro_zoomed.png') },
      { name: 'ST1 (Chengqi)', location: 'Tepat di bawah pupil, di tepi tulang orbital', technique: 'Tekan sangat ringan ke atas. Hati-hati — area sensitif! 30 detik per mata.', duration: 60, macroImage: require('./assets/acu_st1_chengqi_macro.png') },
      { name: 'GB20 (Fengchi)', location: 'Dasar tengkorak', technique: 'Tekan ke atas. Melancarkan aliran darah ke mata. 2 menit.', duration: 120, macroImage: require('./assets/acu_gb20_fengchi_macro.png') },
      { name: 'LV3 (Taichong)', location: 'Punggung kaki', technique: 'Dalam TCM, mata diatur oleh meridian hati. Tekan untuk "bersihkan mata". 1 menit per kaki.', duration: 60, macroImage: require('./assets/acu_lv3_taichong_macro.png') },
    ], totalDuration: '6-8 menit', evidence: 'Studi JAMA Ophthalmology 2021: akupresur area orbital mengurangi kelelahan mata digital 45%.' },
  { id: 'flu', icon: '🤧', name: 'Flu, Pilek & Batuk', desc: 'Hidung mampet, bersin, batuk, tenggorokan sakit',
    points: [
      { name: 'LI20 (Yingxiang)', location: 'Samping cuping hidung', technique: 'Tekan kedua sisi hidung ke atas. Langsung membuka hidung mampet! 1 menit.', duration: 60 },
      { name: 'LU7 (Lieque)', location: '2 jari di atas pergelangan, sisi ibu jari', technique: 'Titik komando paru-paru. Tekan kuat, pijat. 1 menit per tangan.', duration: 60 },
      { name: 'GB20 (Fengchi)', location: 'Dasar tengkorak', technique: '"Wind Pool" — mengusir angin patogen. Tekan kuat ke atas. 2 menit.', duration: 120 },
      { name: 'ST36 (Zusanli)', location: '4 jari di bawah lutut', technique: 'Menguatkan imunitas & energi saat sakit. 1 menit per kaki.', duration: 60 },
    ], totalDuration: '8-10 menit', evidence: 'Studi Evid Based Complement Alt Med 2015: akupresur mempercepat pemulihan flu 2 hari.' },
  { id: 'knee', icon: '🦵', name: 'Nyeri Lutut', desc: 'Nyeri lutut, osteoarthritis, lutut kaku',
    points: [
      { name: 'Xiyan (Mata Lutut)', location: 'Cekungan di kedua sisi tendon di bawah tempurung lutut', technique: 'Tekan kedua "mata lutut" bersamaan dengan ibu jari. Pijat melingkar. 2 menit.', duration: 120 },
      { name: 'ST36 (Zusanli)', location: '4 jari di bawah lutut, sisi luar', technique: 'Tekan kuat. Melancarkan Qi ke seluruh kaki. 2 menit.', duration: 120 },
      { name: 'SP9 (Yinlingquan)', location: 'Cekungan di sisi dalam lutut, di bawah tulang', technique: 'Tekan di cekungan tulang tibia. Mengurangi pembengkakan. 1 menit per lutut.', duration: 60 },
      { name: 'UB40 (Weizhong)', location: 'Tengah lipatan belakang lutut', technique: 'Tekan sedang. Melancarkan darah & mengurangi kekakuan. 1 menit per lutut.', duration: 60 },
    ], totalDuration: '8 menit', evidence: 'Meta-analisis Arthritis Research 2020: akupresur mengurangi nyeri lutut OA 35-40%.' },
  { id: 'hypertension', icon: '🫀', name: 'Tekanan Darah Tinggi', desc: 'Hipertensi, pusing, jantung berdebar',
    points: [
      { name: 'LV3 (Taichong)', location: 'Punggung kaki, antara tulang jari 1 & 2', technique: 'Titik UTAMA untuk hipertensi. Tekan kuat, rasakan nyeri ringan = tepat. 3 menit per kaki.', duration: 180 },
      { name: 'GB20 (Fengchi)', location: 'Dasar tengkorak, cekungan samping leher', technique: 'Tekan kuat ke atas. Menurunkan tekanan kepala. 2 menit.', duration: 120 },
      { name: 'PC6 (Neiguan)', location: '3 jari di atas pergelangan dalam', technique: 'Menstabilkan jantung & menurunkan tekanan. 2 menit per tangan.', duration: 120 },
      { name: 'KD1 (Yongquan)', location: 'Cekungan telapak kaki', technique: 'Menarik energi ke bawah— prinsip TCM untuk hipertensi. 2 menit per kaki.', duration: 120 },
    ], totalDuration: '10-12 menit', evidence: 'Studi J Alt Complement Med 2015: akupresur LV3 menurunkan tekanan sistolik rata-rata 15mmHg.' },
  { id: 'toothache', icon: '🦷', name: 'Sakit Gigi', desc: 'Nyeri gigi, gusi bengkak, sakit rahang',
    points: [
      { name: 'LI4 (Hegu)', location: 'Antara ibu jari & telunjuk', technique: 'Titik #1 untuk nyeri gigi! Tekan SANGAT kuat 2-3 menit. Sisi yang sama dengan gigi yang sakit.', duration: 180 },
      { name: 'ST6 (Jiache)', location: 'Otot rahang — terasa mengeras saat menggigit', technique: 'Tekan otot masseter saat mulut rileks. Pijat melingkar. 1 menit per sisi.', duration: 60, macroImage: require('./assets/acu_st6_jiache_macro.png') },
      { name: 'ST44 (Neiting)', location: 'Antara jari kaki ke-2 & ke-3, di lipatan kulit', technique: 'Tekan kuat. Titik meridian lambung — efektif untuk nyeri gigi atas. 1 menit per kaki.', duration: 60 },
    ], totalDuration: '5-6 menit', evidence: 'Studi Anesth Prog 2019: akupresur LI4 mengurangi nyeri gigi 50% dalam 5 menit.' },
  { id: 'fatigue', icon: '😩', name: 'Kelelahan & Energi Rendah', desc: 'Lesu, lelah kronis, kurang semangat',
    points: [
      { name: 'ST36 (Zusanli)', location: '4 jari di bawah lutut, sisi luar tulang kering', technique: 'Titik energi #1 di seluruh tubuh! "Tiga Mil Kaki" — dapat berjalan 3 mil lagi. 2 menit per kaki.', duration: 120 },
      { name: 'GV20 (Baihui)', location: 'Puncak kepala', technique: 'Tekan ringan. Mengangkat energi Yang ke atas. Langsung terasa lebih segar. 1 menit.', duration: 60 },
      { name: 'CV6 (Qihai)', location: '2 jari di bawah pusar', technique: '"Lautan Qi" — pusat energi vital. Tekan hangat, napas dalam ke perut. 2 menit.', duration: 120 },
      { name: 'LI4 (Hegu)', location: 'Antara ibu jari & telunjuk', technique: 'Melancarkan Qi seluruh tubuh. Tekan kuat, pijat. 1 menit per tangan.', duration: 60 },
    ], totalDuration: '8 menit', evidence: 'Studi Nurs Res 2018: akupresur ST36 meningkatkan energi & mengurangi kelelahan 40%.' },
  { id: 'nausea', icon: '🤮', name: 'Mual & Vertigo', desc: 'Mual, mabuk perjalanan, vertigo, morning sickness',
    points: [
      { name: 'PC6 (Neiguan)', location: '3 jari di atas pergelangan dalam, antara 2 tendon', technique: 'Titik anti-mual PALING EFEKTIF. Tekan kuat 2-3 menit per tangan. Bisa pakai gelang akupresur.', duration: 180 },
      { name: 'ST36 (Zusanli)', location: '4 jari di bawah lutut, sisi luar', technique: 'Menstabilkan lambung. Tekan kuat, pijat. 2 menit per kaki.', duration: 120 },
      { name: 'CV12 (Zhongwan)', location: 'Tengah perut, antara pusar & tulang dada', technique: 'Tekan ringan melingkar searah jarum jam. 1 menit.', duration: 60 },
    ], totalDuration: '6-8 menit', evidence: 'Cochrane Review 2015: akupresur PC6 efektif untuk mual post-operasi & kehamilan.' },
  { id: 'respiratory', icon: '🫁', name: 'Sesak Napas & Asma', desc: 'Sesak, asma ringan, dada terasa berat',
    points: [
      { name: 'LU1 (Zhongfu)', location: 'Dada atas, 2 jari di bawah ujung selangka, sisi luar', technique: 'Tekan sedang. "Istana Tengah" paru. Membuka dada. 2 menit per sisi.', duration: 120 },
      { name: 'LU7 (Lieque)', location: '2 jari di atas pergelangan, sisi ibu jari', technique: 'Titik komando paru. Tekan kuat. 1 menit per tangan.', duration: 60 },
      { name: 'CV17 (Danzhong)', location: 'Tengah tulang dada, setinggi puting', technique: 'Tekan sedang. "Lautan Qi" dada. Bernapas dalam sambil menekan. 2 menit.', duration: 120 },
      { name: 'UB13 (Feishu)', location: 'Punggung atas, 2 jari dari tulang belakang, setinggi vertebra T3', technique: 'Gunakan bola tenis: berbaring di atasnya. Titik Shu punggung paru. 2 menit.', duration: 120 },
    ], totalDuration: '8-10 menit', evidence: 'Studi Respir Med 2019: akupresur dada meningkatkan FEV1 paru 15% pada penderita asma ringan.' },
];


const CHAKRA_QUIZ = [
  { chakra: 'Root', question: 'Apakah Anda sering merasa cemas tentang keamanan/keuangan?', color: '#FF0000' },
  { chakra: 'Sacral', question: 'Apakah Anda sulit mengekspresikan emosi atau kreativitas?', color: '#FF8C00' },
  { chakra: 'Solar Plexus', question: 'Apakah Anda sering ragu-ragu atau kurang percaya diri?', color: '#FFD700' },
  { chakra: 'Heart', question: 'Apakah Anda sulit membuka diri atau memaafkan?', color: '#00FF00' },
  { chakra: 'Throat', question: 'Apakah Anda sulit berbicara jujur atau mengekspresikan diri?', color: '#00BFFF' },
  { chakra: 'Third Eye', question: 'Apakah Anda merasa terputus dari intuisi Anda?', color: '#4B0082' },
  { chakra: 'Crown', question: 'Apakah Anda merasa kehilangan makna atau tujuan hidup?', color: '#9400D3' },
];

const CHAKRA_PRACTICES = {
  Root: { practice: 'Grounding Walk', image: require('./assets/chakra_root.png'), steps: ['Bertelanjang kaki di tanah 10 menit', 'Tarik napas: "Saya aman"', 'Buang napas: "Saya terhubung dengan bumi"', 'Rasakan berat tubuh di telapak kaki'], affirm: 'Saya aman. Saya cukup. Bumi menopang saya.', duration: 600 },
  Sacral: { practice: 'Creative Flow', image: require('./assets/chakra_sacral.png'), steps: ['Putar pinggul melingkar lambat 1 menit', 'Letakkan tangan di bawah pusar', 'Bernapas: bayangkan cahaya oranye di perut bawah', 'Afirmasi sambil bernapas'], affirm: 'Saya mengizinkan diri merasakan. Kreativitas mengalir melalui saya.', duration: 300 },
  'Solar Plexus': { practice: 'Power Breathing', image: require('./assets/chakra_solar_plexus.png'), steps: ['Berdiri tegak, tangan di ulu hati', 'Breath of Fire: napas cepat pendek lewat hidung 30x', 'Tahan napas 15 detik', 'Buang pelan, rasakan kekuatan'], affirm: 'Saya mampu. Saya kuat. Saya adalah api.', duration: 300 },
  Heart: { practice: 'Heart Opening', image: require('./assets/chakra_heart.png'), steps: ['Duduk nyaman, tangan di dada', 'Bernapas lambat: 5 detik masuk, 5 detik keluar', 'Ingat seseorang yang Anda cintai', 'Kirim cinta dari jantung Anda ke dunia'], affirm: 'Saya terbuka untuk memberi dan menerima cinta.', duration: 300 },
  Throat: { practice: 'Voice Activation', image: require('./assets/chakra_throat.png'), steps: ['Humming: bersenandung "mmm" 1 menit (vibrasi vagus)', 'Chanting "AUM" 5x — suara penuh', 'Bicara keras: kebenaran yang perlu Anda ungkapkan', 'Gargle air hangat 30 detik'], affirm: 'Suara saya penting. Kebenaran mengalir melalui saya.', duration: 300 },
  'Third Eye': { practice: 'Trataka Meditation', image: require('./assets/chakra_third_eye.png'), steps: ['Nyalakan lilin di kegelapan', 'Tatap api tanpa berkedip 1-2 menit', 'Tutup mata, lihat after-image di "layar mental"', 'Fokus pada titik antara alis'], affirm: 'Saya percaya intuisi saya. Saya melihat dengan jelas.', duration: 600 },
  Crown: { practice: 'Silent Meditation', image: require('./assets/chakra_crown.png'), steps: ['Duduk diam, tutup mata', 'Bayangkan cahaya putih keunguan di puncak kepala', 'Rasakan koneksi dengan sesuatu yang lebih besar', 'Biarkan pikiran lewat tanpa menilai'], affirm: 'Saya terhubung dengan Sumber. Saya adalah kesadaran.', duration: 600 },
};

// ============================================================
// AI CONTEXT: Mapping tools for AI Suggestions
// ============================================================
const APP_TOOLS_DATA = [
  { screen: 'breathing', params: { pattern: 'vagus' }, name: 'Napas Vagus', desc: 'Menenangkan sistem saraf & mengurangi kecemasan.' },
  { screen: 'breathing', params: { pattern: '478' }, name: 'Napas 4-7-8', desc: 'Sangat efektif untuk membantu tidur cepat.' },
  { screen: 'breathing', params: { pattern: 'box' }, name: 'Box Breathing', desc: 'Meningkatkan fokus & keseimbangan instan.' },
  { screen: 'breathing', params: { pattern: 'wimhof' }, name: 'Wim Hof Style', desc: 'Meningkatkan energi & imunitas tubuh.' },
  { screen: 'bodyscan', params: {}, name: 'Body Scan Meditation', desc: 'Relaksasi total seluruh tubuh & kesadaran.' },
  { screen: 'routine', params: { routineId: 'morning-stretch' }, name: 'Morning Stretch', desc: 'Meningkatkan fleksibilitas & semangat pagi.' },
  { screen: 'routine', params: { routineId: 'evening-yoga' }, name: 'Yoga Malam', desc: 'Melepas ketegangan otot sebelum tidur.' },
  { screen: 'routine', params: { routineId: 'fascia-release' }, name: 'Fascia Release', desc: 'Melepas emosi tersimpan di jaringan ikat.' },
  { screen: 'acupressure', params: { pointId: 'li4' }, name: 'Titik Hegu (LI4)', desc: 'Sakit kepala, stres, dan sistem imunitas.' },
  { screen: 'acupressure', params: { pointId: 'pc6' }, name: 'Titik Neiguan (PC6)', desc: 'Mual, kecemasan, dan ketenangan jantung.' },
  { screen: 'acupressure', params: { pointId: 'st36' }, name: 'Titik Zusanli (ST36)', desc: 'Energi, pencernaan, dan kesehatan jangka panjang.' },
  { screen: 'acupressure', params: { pointId: 'gv20' }, name: 'Titik Baihui (GV20)', desc: 'Kejernihan mental dan fokus di puncak kepala.' },
  { screen: 'seft', params: {}, name: 'SEFT Therapy', desc: 'Tapping meridian untuk masalah emosional berat.' },
  { screen: 'diseaseAcu', params: {}, name: 'Menu Obati', desc: 'Daftar lengkap solusi akupresur untuk 15 penyakit.' },
  { screen: 'fasting', params: {}, name: 'Fasting Timer', desc: 'Memonitor fase metabolisme & autophagy tubuh.' },
  { screen: 'cold', params: {}, name: 'Cold Exposure', desc: 'Menurunkan inflamasi & meningkatkan dopamine.' },
];

// ============================================================
// MAIN APP
// ============================================================

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [navStack, setNavStack] = useState([]);
  const [aiConfig, setAiConfig] = useState({ provider: 'openrouter', model: 'openrouter/free', apiKey: '' });
  const [userBio, setUserBio] = useState({ name: '', age: '', weight: '', height: '' });
  const [isAiValidated, setIsAiValidated] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const { width: sw } = useWindowDimensions();
  const isTab = sw >= 768;

  const currentNav = navStack[navStack.length - 1] || null;
  const activeScreen = currentNav?.screen;
  const screenParams = currentNav?.params || {};

  useEffect(() => {
    const loadData = async () => {
      try {
        const [savedAi, savedBio] = await Promise.all([
          AsyncStorage.getItem('yourbody_ai_config'),
          AsyncStorage.getItem('yourbody_user_bio')
        ]);
        if (savedAi) setAiConfig(JSON.parse(savedAi));
        if (savedBio) setUserBio(JSON.parse(savedBio));
      } catch (e) {}
    };
    loadData();
  }, []);

  const navigate = useCallback((screen, params = {}) => {
    fadeAnim.setValue(0);
    setNavStack(prev => [...prev, { screen, params }]);
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: Platform.OS !== 'web' }).start();
  }, [fadeAnim]);

  const goBack = useCallback(() => {
    fadeAnim.setValue(0);
    setNavStack(prev => prev.slice(0, -1));
    Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: Platform.OS !== 'web' }).start();
  }, [fadeAnim]);

  // Handle Android Physical Back Button
  useEffect(() => {
    const onBackPress = () => {
      if (navStack.length > 0) {
        goBack();
        return true;
      }
      return false;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [navStack, goBack]);

  const renderContent = () => {
    if (activeScreen) {
      return (
        <Animated.View style={[st.flex1, { opacity: fadeAnim }]}>
          {activeScreen === 'breathing' && <BreathingTool pattern={screenParams.pattern || 'vagus'} goBack={goBack} navigate={navigate} />}
          {activeScreen === 'timer' && <TimerTool seconds={screenParams.seconds} title={screenParams.title} goBack={goBack} />}
          {activeScreen === 'bodyscan' && <BodyScanTool goBack={goBack} />}
          {activeScreen === 'routine' && <RoutineTool routineId={screenParams.routineId} goBack={goBack} />}
          {activeScreen === 'acupressure' && <AcupressureTool pointId={screenParams.pointId} goBack={goBack} navigate={navigate} />}
          {activeScreen === 'cold' && <ColdExposureTool goBack={goBack} />}
          {activeScreen === 'chakraQuiz' && <ChakraQuizTool goBack={goBack} navigate={navigate} />}
          {activeScreen === 'chakraPractice' && <ChakraPracticeTool chakra={screenParams.chakra} goBack={goBack} />}
          {activeScreen === 'fasting' && <FastingTool goBack={goBack} />}
          {activeScreen === 'consultation' && <ConsultationTool goBack={goBack} navigate={navigate} aiConfig={aiConfig} userBio={userBio} isAiValidated={isAiValidated} />}
          {activeScreen === 'allBreathing' && <AllBreathingScreen goBack={goBack} navigate={navigate} />}
          {activeScreen === 'allAcupressure' && <AllAcupressureScreen goBack={goBack} navigate={navigate} />}
          {activeScreen === 'allRoutines' && <AllRoutinesScreen goBack={goBack} navigate={navigate} />}
          {activeScreen === 'seft' && <SEFTScreen goBack={goBack} navigate={navigate} />}
          {activeScreen === 'seftSession' && <SEFTSessionTool problem={screenParams.problem} customText={screenParams.customText} goBack={goBack} />}
          {activeScreen === 'diseaseAcu' && <DiseaseAcuScreen goBack={goBack} navigate={navigate} />}
          {activeScreen === 'diseaseAcuDetail' && <DiseaseAcuDetailTool diseaseId={screenParams.diseaseId} goBack={goBack} />}
        </Animated.View>
      );
    }
    switch (activeTab) {
      case 'home': return <HomeScreen navigate={navigate} isTab={isTab} sw={sw} userBio={userBio} />;
      case 'practice': return <PracticeScreen navigate={navigate} isTab={isTab} sw={sw} />;
      case 'discover': return <DiscoverScreen navigate={navigate} isTab={isTab} sw={sw} />;
      case 'wisdom': return <WisdomScreen navigate={navigate} isTab={isTab} sw={sw} />;
      case 'settings': return <SettingsScreen aiConfig={aiConfig} setAiConfig={setAiConfig} userBio={userBio} setUserBio={setUserBio} isAiValidated={isAiValidated} setIsAiValidated={setIsAiValidated} />;
      default: return <HomeScreen navigate={navigate} isTab={isTab} sw={sw} />;
    }
  };

  if (!renderContent) return null; // Very basic safety

  return (
    <SafeAreaView style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <View style={st.flex1}>{renderContent()}</View>
      {!activeScreen && <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />}
    </SafeAreaView>
  );
}

// ============================================================
// HOME SCREEN — What to do RIGHT NOW
// ============================================================

const HomeScreen = ({ navigate, isTab, sw, userBio }) => {
  const [time, setTime] = useState(new Date());
  const [checkedActions, setCheckedActions] = useState({});
  const phase = useMemo(() => getTimePhase(), [time]);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const toggleCheck = (i) => setCheckedActions(p => ({ ...p, [i]: !p[i] }));

  const handleAction = (action, idx) => {
    if (action.actionType === 'checklist') { toggleCheck(idx); return; }
    if (action.actionType === 'timer') { navigate('timer', { seconds: action.seconds, title: action.title }); return; }
    if (action.actionType === 'breathing') { navigate('breathing', { pattern: action.pattern }); return; }
    if (action.actionType === 'bodyscan') { navigate('bodyscan'); return; }
    if (action.actionType === 'routine') { navigate('routine', { routineId: action.routineId }); return; }
    if (action.actionType === 'acupressure') { navigate('acupressure', { pointId: action.pointId }); return; }
    if (action.actionType === 'cold') { navigate('cold'); return; }
  };

  const completedCount = Object.values(checkedActions).filter(Boolean).length;

  return (
    <ScrollView style={st.screen} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
      <View style={st.header}>
        <Text style={st.greeting}>HALO, {userBio.name ? userBio.name.toUpperCase() : 'YOUR BODY'}!</Text>
        <Text style={st.appTitle}>Mau praktik apa hari ini?</Text>
      </View>

      {/* Current Phase */}
      <View style={[st.card, { borderLeftColor: phase.color, borderLeftWidth: 4 }]}>
        <View style={st.row}>
          <Text style={{ fontSize: 40, marginRight: 14 }}>{phase.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[st.h2, { color: phase.color }]}>{phase.phase}</Text>
            <Text style={st.timeText}>{time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</Text>
          </View>
          <View style={[st.badge, { backgroundColor: C.emerald + '20' }]}>
            <Text style={[st.badgeText, { color: C.emerald }]}>{completedCount}/{phase.actions.length}</Text>
          </View>
        </View>
      </View>

      {/* Actionable Items */}
      <Text style={st.sectionTitle}>🎯 Aksi Sekarang</Text>
      {phase.actions.map((action, idx) => (
        <TouchableOpacity
          key={idx}
          style={[st.actionCard, checkedActions[idx] && st.actionCardDone]}
          onPress={() => handleAction(action, idx)}
          activeOpacity={0.7}
        >
          <View style={st.row}>
            <Text style={{ fontSize: 28, marginRight: 14 }}>{action.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[st.actionTitle, checkedActions[idx] && st.textStrike]}>{action.title}</Text>
              <Text style={st.actionDesc}>{action.desc}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={st.actionDuration}>{action.duration}</Text>
              {action.actionType !== 'checklist' && <Text style={[st.actionGo, { color: phase.color }]}>MULAI →</Text>}
              {action.actionType === 'checklist' && (
                <Text style={{ fontSize: 22 }}>{checkedActions[idx] ? '✅' : '⬜'}</Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      ))}

      {/* Quick Access */}
      <Text style={st.sectionTitle}>⚡ Akses Cepat</Text>
      <View style={st.quickGrid}>
        <QuickBtn icon="💬" label="Tanya Tubuh" onPress={() => navigate('consultation')} />
        <QuickBtn icon="🫁" label="Napas" onPress={() => navigate('allBreathing')} />
        <QuickBtn icon="⏱️" label="Puasa" onPress={() => navigate('fasting')} />
        <QuickBtn icon="🙏" label="SEFT" onPress={() => navigate('seft')} />
        <QuickBtn icon="🏥" label="Obati" onPress={() => navigate('diseaseAcu')} />
        <QuickBtn icon="👆" label="Acupressure" onPress={() => navigate('allAcupressure')} />
        <QuickBtn icon="🧊" label="Cold" onPress={() => navigate('cold')} />
        <QuickBtn icon="🧘" label="Body Scan" onPress={() => navigate('bodyscan')} />
        <QuickBtn icon="⚡" label="Chakra" onPress={() => navigate('chakraQuiz')} />
      </View>
    </ScrollView>
  );
};

const QuickBtn = ({ icon, label, onPress }) => (
  <TouchableOpacity style={st.quickBtn} onPress={onPress} activeOpacity={0.7}>
    <Text style={{ fontSize: 26 }}>{icon}</Text>
    <Text style={st.quickLabel}>{label}</Text>
  </TouchableOpacity>
);

// ============================================================
// PRACTICE SCREEN — All Interactive Tools
// ============================================================

const PracticeScreen = ({ navigate, isTab, sw }) => {
  const tools = [
    { id: 'seft', icon: '🙏', title: 'SEFT Therapy', desc: 'Spiritual Emotional Freedom Technique — ketuk 18 titik meridian + doa', color: C.gold, badge: 'Guided' },
    { id: 'diseaseAcu', icon: '🏥', title: 'Obati dengan Akupresur', desc: 'Pilih gangguan/penyakit → panduan titik akupresur spesifik', color: C.rose, badge: '15 kondisi' },
    { id: 'allBreathing', icon: '🫁', title: 'Latihan Napas', desc: '5 pola napas untuk berbagai kondisi', color: C.cyan, badge: '5 pola' },
    { id: 'fasting', icon: '⏱️', title: 'Fasting Timer', desc: 'Hitung waktu puasa & fase autophagy', color: C.emerald, badge: 'Timer' },
    { id: 'bodyscan', icon: '🧘', title: 'Body Scan Meditation', desc: 'Guided meditation 9 area tubuh', color: C.violet, badge: '6 min' },
    { id: 'allAcupressure', icon: '👆', title: 'Acupressure Mandiri', desc: '12 titik penyembuhan + timer per titik', color: C.pink, badge: '12 titik' },
    { id: 'cold', icon: '🧊', title: 'Cold Exposure', desc: 'Progressive cold shower protocol', color: C.blue, badge: 'Timer' },
    { id: 'chakraQuiz', icon: '⚡', title: 'Chakra Assessment', desc: 'Cek keseimbangan chakra + latihan', color: C.gold, badge: 'Quiz' },
    { id: 'allRoutines', icon: '🤸', title: 'Stretch & Movement', desc: '3 rutinitas gerakan: pagi, malam, fascia', color: C.orange, badge: '3 set' },
  ];

  return (
    <ScrollView style={st.screen} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
      <Text style={st.screenTitle}>🛠️ Praktik</Text>
      <Text style={st.screenSub}>Alat interaktif untuk penyembuhan diri</Text>

      {tools.map((tool) => (
        <TouchableOpacity key={tool.id} style={[st.toolCard, { borderLeftColor: tool.color, borderLeftWidth: 4 }]}
          onPress={() => navigate(tool.id)} activeOpacity={0.7}>
          <View style={st.row}>
            <Text style={{ fontSize: 36, marginRight: 16 }}>{tool.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={st.toolTitle}>{tool.title}</Text>
              <Text style={st.toolDesc}>{tool.desc}</Text>
            </View>
            <View style={[st.toolBadge, { backgroundColor: tool.color + '20' }]}>
              <Text style={[st.toolBadgeText, { color: tool.color }]}>{tool.badge}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

// ============================================================
// DISCOVER SCREEN — Knowledge with Actions
// ============================================================

const DiscoverScreen = ({ navigate, isTab, sw }) => {
  const [expandedId, setExpandedId] = useState(null);

  const topics = [
    { id: 'fascia', icon: '🕸️', title: 'Emosi Tersimpan di Tubuh', color: C.orange,
      insight: 'Fascia (jaringan ikat) memiliki 6-10x lebih banyak reseptor saraf daripada otot. Stres & trauma menciptakan "armor" di jaringan — rilekskan jaringan = lepaskan emosi.',
      action: 'Lakukan Fascia Release', actionId: 'routine', params: { routineId: 'fascia-release' }},
    { id: 'gut', icon: '🦠', title: '95% Serotonin dari Usus', color: C.emerald,
      insight: 'Kebahagiaan dimulai dari perut. Usus Anda memiliki 100 juta neuron & memproduksi hampir semua serotonin. Bakteri usus berkomunikasi dengan otak via nervus vagus.',
      action: 'Stimulasi Vagus Sekarang', actionId: 'breathing', params: { pattern: 'vagus' }},
    { id: 'pineal', icon: '👁️', title: 'Mata Ketiga Biologis', color: C.indigo,
      insight: 'Kelenjar pineal mengandung sel fotoreseptor & kristal piezoelektrik. Meditasi meningkatkan aliran darah ke pineal. Kalsifikasi dimulai sejak remaja.',
      action: 'Meditasi Mata Ketiga', actionId: 'chakraPractice', params: { chakra: 'Third Eye' }},
    { id: 'heart', icon: '🫀', title: 'Jantung = Otak Kedua', color: C.rose,
      insight: 'Jantung memiliki 40.000 neuron sendiri & medan EM 60x lebih kuat dari otak. Heart coherence (napas 5-5) menyinkronkan jantung & otak untuk performa optimal.',
      action: 'Heart Coherence Breathing', actionId: 'breathing', params: { pattern: 'coherence' }},
    { id: 'bone', icon: '🦴', title: 'Tulang Menghasilkan Listrik', color: C.amber,
      insight: 'Tulang bersifat piezoelektrik — menghasilkan listrik saat ditekan. Ini sinyal untuk regenerasi. Olahraga beban memperkuat tulang via sinyal bioelektrik.',
      action: 'Stretching + Weight Bearing', actionId: 'allRoutines' },
    { id: 'cold', icon: '🧊', title: 'Cold = Obat Alami', color: C.blue,
      insight: 'Cold exposure 2-3 menit: norepinefrin naik 200-300%, brown fat aktif, mitokondria baru terbentuk, mood meningkat dramatis.',
      action: 'Mulai Cold Exposure', actionId: 'cold' },
    { id: 'earth', icon: '🌍', title: 'Bumi = Charger Alami', color: C.teal,
      insight: 'Bumi memiliki muatan -400,000V. Kontak langsung kulit-tanah mentransfer elektron anti-inflamasi. Studi: 30 menit grounding menurunkan inflamasi & memperbaiki tidur.',
      action: 'Timer Grounding 20 min', actionId: 'timer', params: { seconds: 1200, title: 'Grounding Session' }},
    { id: 'cells', icon: '🧬', title: 'Sel Anda Punya Memori', color: C.violet,
      insight: 'Sel non-neural menunjukkan "memori" (Nature 2024). Otot mempertahankan memory epigenetik. Sel dewasa bisa "memutar ulang" gen masa janin. Autophagy membersihkan sel setiap 12-16h puasa.',
      action: 'Mulai Fasting Timer', actionId: 'fasting' },
    { id: 'bio', icon: '✨', title: 'Anda Memancarkan Cahaya', color: C.gold,
      insight: 'Manusia memancarkan biophoton (cahaya ultra-lemah). Wajah paling terang. Intensitas mengikuti ritme sirkadian. Meditator memancarkan foton lebih teratur.',
      action: 'Meditasi Body Scan', actionId: 'bodyscan' },
  ];

  return (
    <ScrollView style={st.screen} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
      <Text style={st.screenTitle}>🔬 Temukan & Praktikkan</Text>
      <Text style={st.screenSub}>Setiap pengetahuan langsung bisa Anda praktikkan</Text>

      {topics.map((t) => (
        <View key={t.id} style={[st.discoverCard, { borderLeftColor: t.color, borderLeftWidth: 4 }]}>
          <TouchableOpacity onPress={() => setExpandedId(expandedId === t.id ? null : t.id)} activeOpacity={0.8}>
            <View style={st.row}>
              <Text style={{ fontSize: 30, marginRight: 14 }}>{t.icon}</Text>
              <Text style={[st.discoverTitle, { flex: 1 }]}>{t.title}</Text>
              <Text style={st.expandIcon}>{expandedId === t.id ? '▲' : '▼'}</Text>
            </View>
          </TouchableOpacity>
          {expandedId === t.id && (
            <View style={st.discoverExpanded}>
              <Text style={st.discoverInsight}>{t.insight}</Text>
              <TouchableOpacity
                style={[st.discoverAction, { backgroundColor: t.color + '20' }]}
                onPress={() => navigate(t.actionId, t.params || {})}
                activeOpacity={0.7}
              >
                <Text style={[st.discoverActionText, { color: t.color }]}>▶ {t.action}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

// ============================================================
// WISDOM SCREEN — Actionable Daily Wisdom
// ============================================================

const DAILY_WISDOM = [
  { text: 'Tubuh Anda menghasilkan 3.8 juta sel per detik.', action: 'Dukung regenerasi: mulai fasting timer', actionId: 'fasting', icon: '✨' },
  { text: '95% serotonin diproduksi di usus.', action: 'Stimulasi vagus untuk koneksi gut-brain', actionId: 'breathing', params: { pattern: 'vagus' }, icon: '🧠' },
  { text: 'Pelukan 20 detik melepas oksitosin, turunkan kortisol.', action: 'Peluk seseorang sekarang — 20 detik penuh!', actionId: null, icon: '🤗' },
  { text: 'Napas sadar mengaktifkan gen anti-inflamasi.', action: 'Praktikkan Box Breathing 3 menit', actionId: 'breathing', params: { pattern: 'box' }, icon: '🫁' },
  { text: 'Fascia memiliki 6-10x lebih banyak sensor saraf daripada otot.', action: 'Lakukan Fascia Release Routine', actionId: 'routine', params: { routineId: 'fascia-release' }, icon: '🕸️' },
  { text: 'Kelenjar pineal mengandung kristal piezoelektrik.', action: 'Meditasi Mata Ketiga 5 menit', actionId: 'chakraPractice', params: { chakra: 'Third Eye' }, icon: '👁️' },
  { text: 'Meditasi 8 minggu mengubah struktur fisik otak.', action: 'Mulai Body Scan Meditation', actionId: 'bodyscan', icon: '🧘' },
  { text: 'Cold exposure meningkatkan norepinefrin 200-300%.', action: 'Cold Shower 2 menit sekarang', actionId: 'cold', icon: '🧊' },
  { text: 'Bertelanjang kaki di tanah mentransfer elektron anti-inflamasi.', action: 'Timer Grounding 20 menit', actionId: 'timer', params: { seconds: 1200, title: 'Grounding' }, icon: '🌍' },
  { text: 'Jantung menghasilkan medan EM 60x lebih kuat dari otak.', action: 'Heart Coherence Breathing', actionId: 'breathing', params: { pattern: 'coherence' }, icon: '🫀' },
  { text: 'Detak jantung sehat menunjukkan variabilitas fraktal.', action: 'Tingkatkan HRV dengan napas 4-4-8', actionId: 'breathing', params: { pattern: 'vagus' }, icon: '💓' },
  { text: 'Autophagy aktif setelah 12-16 jam puasa.', action: 'Mulai Intermittent Fasting', actionId: 'fasting', icon: '♻️' },
  { text: 'Tertawa 20 menit meningkatkan sel NK hingga 40%.', action: 'Tonton sesuatu yang lucu sekarang 😂', actionId: null, icon: '😂' },
  { text: 'Stres kronis setara 10+ tahun penuaan biologis.', action: 'De-stress: 4-7-8 Breathing', actionId: 'breathing', params: { pattern: '478' }, icon: '⏳' },
  { text: 'Titik ST36 di bawah lutut = titik longevity paling terkenal.', action: 'Acupressure ST36 sekarang', actionId: 'acupressure', params: { pointId: 'st36' }, icon: '👆' },
];

const WisdomScreen = ({ navigate }) => {
  const dayIdx = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000) % DAILY_WISDOM.length;
  const today = DAILY_WISDOM[dayIdx];

  return (
    <ScrollView style={st.screen} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
      <Text style={st.screenTitle}>💎 Wisdom Harian</Text>
      <Text style={st.screenSub}>Pengetahuan + aksi langsung</Text>

      {/* Today's Featured */}
      <View style={[st.wisdomHighlight, { borderColor: C.gold + '40' }]}>
        <Text style={{ fontSize: 44, textAlign: 'center', marginBottom: 12 }}>{today.icon}</Text>
        <Text style={st.wisdomText}>{today.text}</Text>
        {today.actionId && (
          <TouchableOpacity style={[st.wisdomAction, { backgroundColor: C.gold + '20' }]}
            onPress={() => navigate(today.actionId, today.params || {})} activeOpacity={0.7}>
            <Text style={[st.wisdomActionText, { color: C.gold }]}>▶ {today.action}</Text>
          </TouchableOpacity>
        )}
        {!today.actionId && <Text style={[st.wisdomActionText, { color: C.gold, marginTop: 12 }]}>💡 {today.action}</Text>}
      </View>

      {/* All Wisdom */}
      <Text style={st.sectionTitle}>Semua Wisdom</Text>
      {DAILY_WISDOM.map((w, idx) => (
        <View key={idx} style={st.wisdomCard}>
          <Text style={{ fontSize: 24, marginRight: 12 }}>{w.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={st.wisdomCardText}>{w.text}</Text>
            {w.actionId ? (
              <TouchableOpacity onPress={() => navigate(w.actionId, w.params || {})} activeOpacity={0.7}>
                <Text style={[st.wisdomCardAction, { color: C.cyan }]}>▶ {w.action}</Text>
              </TouchableOpacity>
            ) : (
              <Text style={[st.wisdomCardAction, { color: C.amber }]}>💡 {w.action}</Text>
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

// ============================================================
// INTERACTIVE TOOLS
// ============================================================

// --- BREATHING TOOL ---
const BreathingTool = ({ pattern, goBack, navigate }) => {
  const p = BREATHING_PATTERNS[pattern] || BREATHING_PATTERNS.vagus;
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [countdown, setCountdown] = useState(p.phases[0].duration);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const currentPhase = p.phases[phaseIdx] || p.phases[0];

  useEffect(() => {
    let t;
    if (running && countdown > 0) {
      t = setInterval(() => setCountdown(c => c - 1), 1000);
    } else if (running && countdown === 0) {
      let nextPi = phaseIdx + 1;
      let nextCy = cycle;
      if (nextPi >= p.phases.length) {
        nextPi = 0;
        nextCy++;
      }
      if (nextCy >= p.cycles) {
        setRunning(false);
        setDone(true);
      } else {
        setPhaseIdx(nextPi);
        setCycle(nextCy);
        setCountdown(p.phases[nextPi].duration);
      }
    }
    return () => clearInterval(t);
  }, [running, countdown, phaseIdx, cycle, p]);

  useEffect(() => {
    if (running) {
      const isInhale = currentPhase.label.includes('Tarik') || currentPhase.label.includes('Cepat');
      const target = isInhale ? 1.5 : 0.7;
      Animated.timing(scaleAnim, { toValue: target, duration: currentPhase.duration * 1000, useNativeDriver: true }).start();
    } else {
      Animated.timing(scaleAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    }
  }, [running, phaseIdx, currentPhase]);

  const start = () => {
    setDone(false); setCycle(0); setPhaseIdx(0); setCountdown(p.phases[0].duration); setRunning(true);
  };
  const stop = () => setRunning(false);

  return (
    <ScrollView style={st.screen} contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
      <BackBtn onPress={() => { stop(); goBack(); }} />
      <Text style={st.screenTitle}>{p.name}</Text>
      <Text style={st.screenSub}>{p.desc}</Text>

      <HeroImage source={p.image} height={200} />

      <TouchableOpacity onPress={running ? stop : start} activeOpacity={0.8}>
        <Animated.View style={[st.breathCircle, { transform: [{ scale: scaleAnim }], borderColor: running ? currentPhase.color : C.t3 }]}>
          {!running && !done && <Text style={[st.breathMainText, { color: C.t2 }]}>MULAI</Text>}
          {running && <>
            <Text style={[st.breathMainText, { color: currentPhase.color }]}>{currentPhase.label}</Text>
            <Text style={st.breathCountdown}>{countdown}s</Text>
            <Text style={st.breathCycle}>Siklus {cycle + 1}/{p.cycles}</Text>
          </>}
          {done && <Text style={[st.breathMainText, { color: C.emerald }]}>✅ Selesai!</Text>}
        </Animated.View>
      </TouchableOpacity>

      {running && <Text style={st.breathHint}>Ketuk untuk berhenti</Text>}
      {done && (
        <TouchableOpacity style={st.restartBtn} onPress={start}><Text style={st.restartText}>🔄 Ulangi</Text></TouchableOpacity>
      )}

      <View style={st.phaseList}>
        <Text style={st.phaseListTitle}>Pola Napas:</Text>
        {p.phases.map((ph, i) => (
          <View key={i} style={[st.phaseItem, phaseIdx === i && running && { backgroundColor: ph.color + '20' }]}>
            <View style={[st.phaseDot, { backgroundColor: ph.color }]} />
            <Text style={st.phaseItemText}>{ph.label} — {ph.duration} detik</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

// --- TIMER TOOL ---
const TimerTool = ({ seconds, title, goBack }) => {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let t;
    if (running && remaining > 0) {
      t = setInterval(() => setRemaining(r => r - 1), 1000);
    } else if (remaining === 0) {
      setRunning(false);
      setDone(true);
    }
    return () => clearInterval(t);
  }, [running, remaining]);

  const toggle = () => {
    if (done) { setRemaining(seconds); setDone(false); return; }
    setRunning(!running);
  };
  const min = Math.floor(remaining / 60);
  const sec = remaining % 60;
  const pct = ((seconds - remaining) / seconds) * 100;

  return (
    <ScrollView style={st.screen} contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
      <BackBtn onPress={() => { setRunning(false); goBack(); }} />
      <Text style={st.screenTitle}>⏱️ {title || 'Timer'}</Text>

      <TouchableOpacity onPress={toggle} activeOpacity={0.8}>
        <View style={[st.timerCircle, done && { borderColor: C.emerald }]}>
          <Text style={[st.timerText, done && { color: C.emerald }]}>
            {done ? '✅' : `${min}:${sec.toString().padStart(2, '0')}`}
          </Text>
          {!done && <Text style={st.timerLabel}>{running ? 'Ketuk = pause' : 'Ketuk = mulai'}</Text>}
          {done && <Text style={[st.timerLabel, { color: C.emerald }]}>Selesai!</Text>}
        </View>
      </TouchableOpacity>


    </ScrollView>
  );
};

// --- BODY SCAN MEDITATION ---
const BodyScanTool = ({ goBack }) => {
  const [stepIdx, setStepIdx] = useState(-1);
  const [countdown, setCountdown] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let t;
    if (running && countdown > 0) {
      t = setInterval(() => setCountdown(c => c - 1), 1000);
    } else if (running && countdown === 0) {
      const nextIdx = stepIdx + 1;
      if (nextIdx < BODY_SCAN_STEPS.length) {
        setStepIdx(nextIdx);
        setCountdown(BODY_SCAN_STEPS[nextIdx].duration);
      } else {
        setRunning(false);
        setStepIdx(BODY_SCAN_STEPS.length);
      }
    }
    return () => clearInterval(t);
  }, [running, countdown, stepIdx]);

  const startScan = () => {
    setStepIdx(0);
    setCountdown(BODY_SCAN_STEPS[0].duration);
    setRunning(true);
  };

  const stopScan = () => {
    setRunning(false);
  };
  const step = BODY_SCAN_STEPS[stepIdx];
  const isDone = stepIdx >= BODY_SCAN_STEPS.length;

  return (
    <ScrollView style={st.screen} contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
      <BackBtn onPress={() => { setRunning(false); goBack(); }} />
      <Text style={st.screenTitle}>🧘 Body Scan</Text>
      <Text style={st.screenSub}>Meditasi pindai tubuh — perjalanan dari kaki ke kepala</Text>

      <HeroImage source={require('./assets/body_scan_banner_premium.png')} />

      {stepIdx === -1 && (
        <TouchableOpacity style={st.startBtn} onPress={startScan} activeOpacity={0.7}>
          <Text style={st.startBtnText}>▶ Mulai Body Scan ({Math.round(BODY_SCAN_STEPS.reduce((a, b) => a + b.duration, 0) / 60)} menit)</Text>
        </TouchableOpacity>
      )}

      {step && running && (
        <View style={st.scanCard}>
          <Text style={st.scanStep}>{stepIdx + 1} / {BODY_SCAN_STEPS.length}</Text>
          
          {step.image && (
            <View style={st.macroContainer}>
              <Image source={step.image} style={st.macroImage} resizeMode="cover" />
              <View style={[st.macroLabel, { backgroundColor: C.violet }]}><Text style={st.macroLabelText}>VISUALISASI AREA</Text></View>
            </View>
          )}

          <View style={st.posisiBox}>
            <Text style={st.posisiLabel}>📍 POSISI TUBUH:</Text>
            <Text style={st.posisiText}>{step.posisi || 'Berbaring Rileks'}</Text>
          </View>

          <Text style={st.scanArea}>{step.area}</Text>
          <Text style={st.scanInstruction}>{step.instruction}</Text>
          <View style={[st.scanTimer, { borderColor: C.violet }]}>
            <Text style={[st.scanTimerText, { color: C.violet }]}>{countdown}s</Text>
          </View>

        </View>
      )}

      {isDone && (
        <View style={st.scanDone}>
          <Text style={{ fontSize: 48, textAlign: 'center' }}>🙏</Text>
          <Text style={[st.scanArea, { color: C.emerald }]}>Body Scan Selesai</Text>
          <Text style={st.scanInstruction}>Tubuh Anda telah di-pindai dan dirilekskan. Bawa kesadaran ini sepanjang hari.</Text>
          <TouchableOpacity style={st.restartBtn} onPress={() => { setStepIdx(-1); setRunning(false); }}>
            <Text style={st.restartText}>🔄 Ulangi</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

// --- ROUTINE TOOL (Stretch/Yoga/Fascia) ---
const RoutineTool = ({ routineId, goBack }) => {
  const routine = STRETCH_ROUTINES[routineId] || STRETCH_ROUTINES['morning-stretch'];
  const [stepIdx, setStepIdx] = useState(-1);
  const [countdown, setCountdown] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let t;
    if (running && countdown > 0) {
      t = setInterval(() => setCountdown(c => c - 1), 1000);
    } else if (running && countdown === 0) {
      const nextIdx = stepIdx + 1;
      if (nextIdx < routine.steps.length) {
        setStepIdx(nextIdx);
        setCountdown(routine.steps[nextIdx].duration);
      } else {
        setRunning(false);
        setStepIdx(routine.steps.length);
      }
    }
    return () => clearInterval(t);
  }, [running, countdown, stepIdx, routine]);

  const startRoutine = () => {
    setStepIdx(0);
    setCountdown(routine.steps[0].duration);
    setRunning(true);
  };

  const stopRoutine = () => setRunning(false);
  const step = routine.steps[stepIdx];
  const isDone = stepIdx >= routine.steps.length;

  return (
    <ScrollView style={st.screen} contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
      <BackBtn onPress={() => { setRunning(false); goBack(); }} />
      <Text style={st.screenTitle}>🤸 {routine.name}</Text>

      <HeroImage source={routine.image} height={160} />

      {stepIdx === -1 && (
        <>
          {routine.steps.map((s, i) => (
            <View key={i} style={st.routinePreview}>
              <View style={[st.routineNum, { backgroundColor: C.orange }]}><Text style={st.routineNumText}>{i + 1}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={st.routineStepName}>{s.name}</Text>
                <Text style={st.routineStepTime}>{s.duration}s</Text>
              </View>
            </View>
          ))}
          <TouchableOpacity style={st.startBtn} onPress={startRoutine} activeOpacity={0.7}>
            <Text style={st.startBtnText}>▶ Mulai Rutinitas</Text>
          </TouchableOpacity>
        </>
      )}

      {step && running && (
        <View style={st.routineActive}>
          <Text style={st.routineActiveStep}>{stepIdx + 1}/{routine.steps.length}</Text>
          
          {/* STEP POSITION IMAGE (Realistic) */}
          {step.image && (
            <View style={st.macroContainer}>
              <Image source={step.image} style={st.macroImage} resizeMode="cover" />
              <View style={[st.macroLabel, { backgroundColor: C.orange }]}><Text style={st.macroLabelText}>POSISI GERAKAN</Text></View>
            </View>
          )}

          <Text style={st.routineActiveName}>{step.name}</Text>
          <Text style={st.routineActiveInstruction}>{step.instruction}</Text>
          <View style={[st.scanTimer, { borderColor: C.orange }]}>
            <Text style={[st.scanTimerText, { color: C.orange }]}>{countdown}s</Text>
          </View>

        </View>
      )}

      {isDone && (
        <View style={st.scanDone}>
          <Text style={{ fontSize: 48, textAlign: 'center' }}>💪</Text>
          <Text style={[st.scanArea, { color: C.emerald }]}>Rutinitas Selesai!</Text>
          <TouchableOpacity style={st.restartBtn} onPress={() => { setStepIdx(-1); setRunning(false); }}>
            <Text style={st.restartText}>🔄 Ulangi</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const AcupressureTool = ({ pointId, goBack, navigate }) => {
  const point = ACUPRESSURE_POINTS.find(p => p.id === pointId) || ACUPRESSURE_POINTS[0];
  const [countdown, setCountdown] = useState(point.duration);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let t;
    if (running && countdown > 0) {
      t = setInterval(() => setCountdown(c => c - 1), 1000);
    } else if (countdown === 0) {
      setRunning(false);
      setDone(true);
    }
    return () => clearInterval(t);
  }, [running, countdown]);

  const toggle = () => {
    if (done) { setCountdown(point.duration); setDone(false); return; }
    setRunning(!running);
  };

  return (
    <ScrollView style={st.screen} contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
      <BackBtn onPress={() => { setRunning(false); goBack(); }} />
      
      {/* GLOBAL CONTEXT MAP (Fixed at top) */}
      <HeroImage source={require('./assets/body_scan_master.png')} height={120} />

      <Text style={{ fontSize: 44, marginTop: 12 }}>{point.icon}</Text>
      <Text style={st.screenTitle}>{point.name}</Text>
      <Text style={[st.screenSub, { textAlign: 'center' }]}>📍 {point.location}</Text>

      {/* MACRO ZOOM DETAIL (Dynamic during session) */}
      {point.macroImage && (
        <View style={st.macroContainer}>
          <Image source={point.macroImage} style={st.macroImage} resizeMode="cover" />
          <View style={st.macroLabel}><Text style={st.macroLabelText}>ZOOM DETAIL</Text></View>
        </View>
      )}

      <View style={st.acuCard}>
        <Text style={st.acuBenefit}>🎯 Manfaat: {point.benefit}</Text>
        <Text style={st.acuInstruction}>{point.instruction}</Text>
      </View>

      <TouchableOpacity onPress={toggle} activeOpacity={0.8}>
        <View style={[st.timerCircle, done && { borderColor: C.emerald }]}>
          <Text style={[st.timerText, done && { color: C.emerald }]}>{done ? '✅' : `${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')}`}</Text>
          <Text style={[st.timerLabel, done && { color: C.emerald }]}>{done ? 'Selesai! Rasakan efeknya.' : running ? 'Tekan & bernapas…' : 'Ketuk untuk mulai'}</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

// --- COLD EXPOSURE TOOL ---
const ColdExposureTool = ({ goBack }) => {
  const [week, setWeek] = useState(1);
  const durations = { 1: 30, 2: 60, 3: 120, 4: 180 };
  const [countdown, setCountdown] = useState(durations[1]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    let t;
    if (running && countdown > 0) {
      t = setInterval(() => setCountdown(c => c - 1), 1000);
    } else if (countdown === 0) {
      setRunning(false);
      setDone(true);
    }
    return () => clearInterval(t);
  }, [running, countdown]);

  const selectWeek = (w) => { setWeek(w); setCountdown(durations[w]); setDone(false); setRunning(false); };

  const toggle = () => {
    if (done) { setCountdown(durations[week]); setDone(false); return; }
    setRunning(!running);
  };

  return (
    <ScrollView style={st.screen} contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
      <BackBtn onPress={() => { setRunning(false); goBack(); }} />
      <Text style={st.screenTitle}>🧊 Cold Exposure</Text>
      <Text style={st.screenSub}>Progressive cold shower protocol</Text>

      <Text style={st.sectionTitle}>Pilih Level:</Text>
      <View style={st.weekRow}>
        {[1, 2, 3, 4].map(w => (
          <TouchableOpacity key={w} style={[st.weekBtn, week === w && { backgroundColor: C.blue + '30', borderColor: C.blue }]}
            onPress={() => selectWeek(w)} activeOpacity={0.7}>
            <Text style={[st.weekBtnText, week === w && { color: C.blue }]}>Minggu {w}</Text>
            <Text style={st.weekBtnDur}>{durations[w]}s</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={toggle} activeOpacity={0.8}>
        <View style={[st.coldCircle, done && { borderColor: C.emerald }]}>
          <Text style={st.coldEmoji}>{done ? '🔥' : '🧊'}</Text>
          <Text style={[st.timerText, done && { color: C.emerald }]}>{done ? 'DONE!' : `${countdown}s`}</Text>
          <Text style={st.timerLabel}>{running ? 'Tahan! Anda kuat!' : done ? 'Norepinefrin naik 200-300%!' : 'Ketuk untuk mulai'}</Text>
        </View>
      </TouchableOpacity>

      <View style={[st.card, { marginTop: 20 }]}>
        <Text style={st.toolTitle}>🔬 Mengapa Cold Exposure Bekerja</Text>
        <Text style={st.toolDesc}>• Norepinefrin naik 200-300% (lebih kuat dari obat ADHD)</Text>
        <Text style={st.toolDesc}>• Brown fat aktif → pembakaran kalori naik</Text>
        <Text style={st.toolDesc}>• Mitokondria baru terbentuk (biogenesis)</Text>
        <Text style={st.toolDesc}>• Mood & fokus meningkat dramatis</Text>
        <Text style={st.toolDesc}>• Nervus vagus teraktivasi</Text>
      </View>
    </ScrollView>
  );
};

// --- CHAKRA QUIZ ---
const ChakraQuizTool = ({ goBack, navigate }) => {
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const answer = (idx, val) => { setAnswers(p => ({ ...p, [idx]: val })); };

  const blocked = useMemo(() => {
    if (!showResult) return [];
    return CHAKRA_QUIZ.filter((_, i) => answers[i] === true).map(q => q.chakra);
  }, [showResult, answers]);

  if (showResult) {
    return (
      <ScrollView style={st.screen} contentContainerStyle={{ paddingBottom: 40 }}>
        <BackBtn onPress={goBack} />
        <Text style={st.screenTitle}>⚡ Hasil Chakra Anda</Text>
        {blocked.length === 0 ? (
          <View style={st.quizResult}>
            <Text style={{ fontSize: 48, textAlign: 'center' }}>🌟</Text>
            <Text style={[st.scanArea, { color: C.emerald }]}>Semua Chakra Seimbang!</Text>
            <Text style={st.scanInstruction}>Terus pertahankan keseimbangan dengan praktik rutin.</Text>
          </View>
        ) : (
          <>
            <Text style={st.screenSub}>{blocked.length} chakra perlu perhatian. Berikut latihan untuk masing-masing:</Text>
            {blocked.map((ch) => {
              const practice = CHAKRA_PRACTICES[ch];
              const quizItem = CHAKRA_QUIZ.find(q => q.chakra === ch);
              return (
                <View key={ch} style={[st.chakraResultCard, { borderLeftColor: quizItem.color, borderLeftWidth: 4 }]}>
                  <Text style={[st.chakraResultName, { color: quizItem.color }]}>{ch} Chakra</Text>
                  <Text style={st.chakraResultPractice}>🎯 {practice.practice}</Text>
                  {practice.steps.map((s, i) => (
                    <View key={i} style={st.chakraStep}>
                      <Text style={st.chakraStepNum}>{i + 1}.</Text>
                      <Text style={st.chakraStepText}>{s}</Text>
                    </View>
                  ))}
                  <View style={st.affirmBox}>
                    <Text style={st.affirmLabel}>🙏 Afirmasi:</Text>
                    <Text style={[st.affirmText, { color: quizItem.color }]}>"{practice.affirm}"</Text>
                  </View>
                  <TouchableOpacity style={[st.startBtn, { backgroundColor: quizItem.color + '20' }]}
                    onPress={() => navigate('chakraPractice', { chakra: ch })} activeOpacity={0.7}>
                    <Text style={[st.startBtnText, { color: quizItem.color }]}>▶ Mulai Latihan ({Math.round(practice.duration / 60)} min)</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </>
        )}
        <TouchableOpacity style={st.restartBtn} onPress={() => { setShowResult(false); setAnswers({}); }}>
          <Text style={st.restartText}>🔄 Ulang Quiz</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  const allAnswered = Object.keys(answers).length === CHAKRA_QUIZ.length;

  return (
    <ScrollView style={st.screen} contentContainerStyle={{ paddingBottom: 40 }}>
      <BackBtn onPress={goBack} />
      <Text style={st.screenTitle}>⚡ Chakra Assessment</Text>
      <Text style={st.screenSub}>Jawab ya/tidak untuk mendeteksi chakra yang perlu perhatian</Text>
      {CHAKRA_QUIZ.map((q, idx) => (
        <View key={idx} style={[st.quizCard, { borderLeftColor: q.color, borderLeftWidth: 4 }]}>
          <Text style={st.quizQ}>{q.question}</Text>
          <View style={st.quizBtns}>
            <TouchableOpacity style={[st.quizBtn, answers[idx] === true && { backgroundColor: C.rose + '30', borderColor: C.rose }]}
              onPress={() => answer(idx, true)}><Text style={[st.quizBtnText, answers[idx] === true && { color: C.rose }]}>Ya</Text></TouchableOpacity>
            <TouchableOpacity style={[st.quizBtn, answers[idx] === false && { backgroundColor: C.emerald + '30', borderColor: C.emerald }]}
              onPress={() => answer(idx, false)}><Text style={[st.quizBtnText, answers[idx] === false && { color: C.emerald }]}>Tidak</Text></TouchableOpacity>
          </View>
        </View>
      ))}
      {allAnswered && (
        <TouchableOpacity style={st.startBtn} onPress={() => setShowResult(true)} activeOpacity={0.7}>
          <Text style={st.startBtnText}>📊 Lihat Hasil & Latihan</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

// --- CHAKRA PRACTICE (GUIDED) ---
const ChakraPracticeTool = ({ chakra, goBack }) => {
  const practice = CHAKRA_PRACTICES[chakra] || CHAKRA_PRACTICES.Heart;
  const quizItem = CHAKRA_QUIZ.find(q => q.chakra === chakra) || { color: C.violet };
  const [countdown, setCountdown] = useState(practice.duration);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let t;
    if (running && countdown > 0) {
      t = setInterval(() => setCountdown(c => c - 1), 1000);
    } else if (countdown === 0) {
      setRunning(false);
      setDone(true);
    }
    return () => clearInterval(t);
  }, [running, countdown]);

  const toggle = () => {
    if (done) { setCountdown(practice.duration); setDone(false); return; }
    setRunning(!running);
  };

  return (
    <ScrollView style={st.screen} contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
      <BackBtn onPress={() => { setRunning(false); goBack(); }} />
      <Text style={st.screenTitle}>{chakra} Chakra</Text>
      <Text style={[st.screenSub, { textAlign: 'center' }]}>{practice.practice}</Text>

      <HeroImage source={practice.image} height={220} />

      <View style={st.chakraPracticeSteps}>
        {practice.steps.map((s, i) => (
          <View key={i} style={st.chakraStep}>
            <View style={[st.routineNum, { backgroundColor: quizItem.color }]}><Text style={st.routineNumText}>{i + 1}</Text></View>
            <Text style={st.chakraStepText}>{s}</Text>
          </View>
        ))}
      </View>

      <View style={st.affirmBox}>
        <Text style={st.affirmLabel}>🙏 Afirmasi (ucapkan pelan):</Text>
        <Text style={[st.affirmText, { color: quizItem.color }]}>"{practice.affirm}"</Text>
      </View>

      <TouchableOpacity onPress={toggle} activeOpacity={0.8}>
        <View style={[st.timerCircle, { borderColor: done ? C.emerald : quizItem.color }]}>
          <Text style={[st.timerText, { color: done ? C.emerald : quizItem.color }]}>
            {done ? '🙏' : `${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')}`}
          </Text>
          <Text style={st.timerLabel}>{done ? 'Namaste 🙏' : running ? 'Berlangsung…' : 'Ketuk = mulai timer'}</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const IF_PROTOCOLS = [
  { id: '16-8', name: '16:8 (Beginner)', hours: 16, desc: 'Metode paling populer untuk manajemen berat badan & energi.' },
  { id: '18-6', name: '18:6 (Intermediate)', hours: 18, desc: 'Meningkatkan ketosis & fokus mental lebih dalam.' },
  { id: '20-4', name: '20:4 (Warrior)', hours: 20, desc: 'Pemicu autophagy & hormon pertumbuhan (HGH) yang kuat.' },
  { id: 'omad', name: 'OMAD (Advanced)', hours: 23, desc: 'One Meal A Day. Regenerasi seluler intensif.' },
  { id: 'custom', name: 'Custom (24h+)', hours: 24, desc: 'Untuk puasa panjang & pembersihan sel total.' },
];

const METABOLIC_PHASES = [
  { h: 0, label: 'Fed State', desc: 'Tubuh memproses makanan. Pemuatan insulin.', color: C.amber },
  { h: 4, label: 'Early Fasting', desc: 'Beralih menggunakan cadangan gula (Glikogen).', color: C.blue },
  { h: 12, label: 'Fat Burning (Ketosis)', desc: 'Glikogen habis. Tubuh mulai membakar lemak menjadi badan keton.', color: C.emerald },
  { h: 16, label: 'Autophagy Detect', desc: 'Sel mulai mendaur ulang komponen yang rusak & menua.', color: C.orange },
  { h: 24, label: 'Deep Renewal', desc: 'Puncak autophagy & regenerasi sel punca dimulai.', color: C.gold },
  { h: 48, label: 'Immune Reset', desc: 'Pembersihan sel imun lama & pembentukan sel baru.', color: C.violet },
];

// --- FASTING TIMER ---
const FastingTool = ({ goBack }) => {
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [method, setMethod] = useState(IF_PROTOCOLS[0]);

  useEffect(() => {
    let t;
    if (startTime) {
      t = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    }
    return () => clearInterval(t);
  }, [startTime]);

  const startFast = () => setStartTime(Date.now());
  const stopFast = () => { setStartTime(null); setElapsed(0); };

  const hours = elapsed / 3600;
  const displayHours = Math.floor(hours);
  const displayMins = Math.floor((elapsed % 3600) / 60);

  const currentPhase = [...METABOLIC_PHASES].reverse().find(p => hours >= p.h) || METABOLIC_PHASES[0];
  const progress = Math.min((hours / method.hours) * 100, 100);

  return (
    <ScrollView style={st.screen} contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
      <BackBtn onPress={() => goBack()} />
      <Text style={st.screenTitle}>⏱️ Fasting Timer</Text>
      <Text style={st.screenSub}>Lacak puasa & fase autophagy Anda</Text>

      <HeroImage source={require('./assets/fasting_banner_premium.png')} />

      {!startTime ? (
        <View style={{ width: '100%' }}>
          <Text style={st.sectionTitle}>Pilih Metode IF:</Text>
          {IF_PROTOCOLS.map((p) => (
            <TouchableOpacity key={p.id} 
              style={[st.toolCard, { borderLeftColor: method.id === p.id ? C.cyan : C.b, borderLeftWidth: 4 }]}
              onPress={() => setMethod(p)} activeOpacity={0.7}>
              <View style={st.row}>
                <Text style={[st.toolTitle, { flex: 1, color: method.id === p.id ? C.cyan : C.t1 }]}>{p.name}</Text>
                {method.id === p.id && <Text style={{ color: C.cyan }}>✓</Text>}
              </View>
              <Text style={st.toolDesc}>{p.desc}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={st.startBtn} onPress={startFast} activeOpacity={0.7}>
            <Text style={st.startBtnText}>▶ Berangkat: {method.name}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ width: '100%', alignItems: 'center' }}>
          
          <View style={[st.fastingCircle, { borderColor: currentPhase.color }]}>
            <Image source={require('./assets/autophagy_detail.png')} style={{ ...StyleSheet.absoluteFillObject, opacity: 0.15 }} />
            <Text style={[st.fastingTime, { color: currentPhase.color }]}>{displayHours}j {displayMins}m</Text>
            <Text style={[st.fastingPhase, { color: currentPhase.color }]}>{currentPhase.label}</Text>
          </View>

          <View style={st.progressBox}>
            <View style={st.row}>
              <Text style={st.progressLabel}>Target: {method.hours} Jam</Text>
              <Text style={[st.progressPct, { color: C.cyan }]}>{Math.round(progress)}%</Text>
            </View>
            <View style={st.progressBar}>
              <View style={[st.progressFill, { width: `${progress}%`, backgroundColor: currentPhase.color }]} />
            </View>
          </View>

          <View style={[st.card, { marginTop: 20, borderLeftColor: currentPhase.color, borderLeftWidth: 4 }]}>
             <Text style={[st.toolTitle, { color: currentPhase.color }]}>🧬 Status Biologis: {currentPhase.label}</Text>
             <Text style={st.toolDesc}>{currentPhase.desc}</Text>
          </View>

          <View style={st.fastingPhases}>
            <Text style={st.label}>Timeline Mendatang:</Text>
            {METABOLIC_PHASES.map((p, i) => (
              <View key={i} style={[st.fastPhaseItem, hours >= p.h && { backgroundColor: p.color + '15' }]}>
                <View style={[st.phaseDot, { backgroundColor: hours >= p.h ? p.color : C.b }]} />
                <Text style={[st.fastPhaseH, { color: hours >= p.h ? C.t1 : C.t3 }]}>{p.h}j</Text>
                <Text style={[st.fastPhaseLabel, { color: hours >= p.h ? p.color : C.t3, fontWeight: hours >= p.h ? '700' : '400' }]}>{p.label}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={[st.stopBtn]} onPress={stopFast} activeOpacity={0.7}>
            <Text style={st.stopBtnText}>⏹ Berhenti Puasa</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

// --- SEFT SCREEN (Problem Selection) ---
const SEFTScreen = ({ goBack, navigate }) => (
  <ScrollView style={st.screen} contentContainerStyle={{ paddingBottom: 20 }}>
    <BackBtn onPress={goBack} />
    <Text style={st.screenTitle}>🙏 SEFT Therapy</Text>
    <Text style={st.screenSub}>Spiritual Emotional Freedom Technique — teknik ketuk titik meridian + doa/kepasrahan oleh Ahmad Faiz Zainuddin</Text>

    <HeroImage source={require('./assets/seft_guide.png')} />

    <View style={[st.card, { borderLeftColor: C.gold, borderLeftWidth: 4, marginBottom: 20, marginTop: 10 }]}>
      <Text style={st.toolTitle}>📖 Apa itu SEFT?</Text>
      <Text style={st.toolDesc}>SEFT menggabungkan energy psychology (EFT) dengan kekuatan spiritual. Ketukan ringan (tapping) pada 18 titik meridian tubuh sambil berdoa/pasrah terbukti efektif mengatasi masalah emosional & fisik.</Text>
      <Text style={[st.toolDesc, { color: C.gold, marginTop: 8 }]}>🔬 Studi NIH: EFT/tapping menurunkan kortisol 43%, anxiety 40%, & depresi signifikan.</Text>
    </View>

    <Text style={st.sectionTitle}>Pilih masalah yang ingin Anda atasi:</Text>
    {SEFT_PROBLEMS.map((p) => (
      <TouchableOpacity key={p.id} style={st.toolCard}
        onPress={() => navigate('seftSession', { problem: p })} activeOpacity={0.7}>
        <View style={st.row}>
          <Text style={{ fontSize: 28, marginRight: 14 }}>{p.icon}</Text>
          <Text style={[st.toolTitle, { flex: 1 }]}>{p.label}</Text>
          <Text style={[st.actionGo, { color: C.gold }]}>MULAI →</Text>
        </View>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

// --- SEFT SESSION TOOL (Guided) ---
const SEFTSessionTool = ({ problem, goBack }) => {
  const [phase, setPhase] = useState('setup'); // setup, tunein, tapping, gamut, tapping2, done
  const [pointIdx, setPointIdx] = useState(0);
  const [gamutIdx, setGamutIdx] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [running, setRunning] = useState(false);
  const [intensity, setIntensity] = useState(8);
  const [intensityAfter, setIntensityAfter] = useState(null);

  const tappingPoints = SEFT_TAPPING_POINTS.filter(p => p.id <= 8 || (p.id >= 10 && p.id <= 16) || p.id === 18);
  const TAP_DURATION = 7;

  useEffect(() => {
    let t;
    if (running && countdown > 0) {
      t = setInterval(() => setCountdown(c => c - 1), 1000);
    } else if (running && countdown === 0) {
      if (phase === 'tapping' || phase === 'tapping2') {
        const nextIdx = pointIdx + 1;
        if (nextIdx < tappingPoints.length) {
          setPointIdx(nextIdx);
          setCountdown(TAP_DURATION);
        } else {
          setRunning(false);
          setPhase(phase === 'tapping' ? 'gamut' : 'done');
        }
      } else if (phase === 'gamut') {
        const nextIdx = gamutIdx + 1;
        if (nextIdx < SEFT_9_GAMUT.length) {
          setGamutIdx(nextIdx);
          setCountdown(SEFT_9_GAMUT[nextIdx].duration);
        } else {
          setRunning(false);
          setPhase('tapping2');
          setPointIdx(0); // Reset pointIdx for tapping2 phase
          setCountdown(TAP_DURATION);
        }
      }
    }
    return () => clearInterval(t);
  }, [running, countdown, phase, pointIdx, gamutIdx, tappingPoints]);

  const startTapping = () => {
    setPointIdx(0);
    setCountdown(TAP_DURATION);
    setRunning(true);
  };

  const startGamut = () => {
    setGamutIdx(0);
    setCountdown(SEFT_9_GAMUT[0].duration);
    setRunning(true);
  };

  const setupText = problem?.id === 'custom'
    ? '"Ya Allah, meskipun saya memiliki [masalah ini], saya ikhlas, saya pasrah pada-Mu sepenuhnya."'
    : `"Ya Allah, meskipun saya merasakan ${problem?.label?.toLowerCase() || 'masalah ini'}, saya ikhlas menerima kondisi ini, saya pasrahkan kesembuhan kepada-Mu."`;


  return (
    <ScrollView style={st.screen} contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
      <BackBtn onPress={() => { setRunning(false); goBack(); }} />

      <HeroImage source={require('./assets/seft_guide.png')} height={200} />

      {/* HEADER */}
      <Text style={{ fontSize: 40, marginTop: 12 }}>{problem?.icon || '🙏'}</Text>
      <Text style={st.screenTitle}>SEFT: {problem?.label || 'Terapi'}</Text>

      {/* PROGRESS */}
      <View style={[st.row, { width: '100%', marginBottom: 16 }]}>
        {['setup', 'tunein', 'tapping', 'gamut', 'tapping2', 'done'].map((p, i) => (
          <View key={p} style={{ flex: 1, alignItems: 'center' }}>
            <View style={[st.phaseDot, {
              backgroundColor: phase === p ? C.gold : ['setup','tunein','tapping','gamut','tapping2','done'].indexOf(phase) > i ? C.emerald : C.b,
              width: 12, height: 12, borderRadius: 6
            }]} />
            <Text style={{ fontSize: 8, color: phase === p ? C.gold : C.t3, marginTop: 4 }}>
              {['Setup', 'Tune-in', 'Tap 1', 'Gamut', 'Tap 2', 'Selesai'][i]}
            </Text>
          </View>
        ))}
      </View>

      {/* PHASE 1: SET-UP */}
      {phase === 'setup' && (
        <View style={st.seftCard}>
          <Text style={[st.scanArea, { color: C.gold }]}>1. The Set-Up</Text>
          <Text style={st.scanInstruction}>Tekan/usap Sore Spot (dada atas) atau ketuk Karate Chop (sisi tangan), sambil ucapkan 3x dengan penuh perasaan:</Text>
          <View style={st.affirmBox}>
            <Text style={[st.affirmText, { color: C.gold }]}>{setupText}</Text>
          </View>
          <Text style={[st.scanInstruction, { marginTop: 12 }]}>Ukur intensitas masalah Anda (0-10):</Text>
          <View style={[st.row, { justifyContent: 'center', flexWrap: 'wrap', gap: 6, marginTop: 8 }]}>
            {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
              <TouchableOpacity key={n} onPress={() => setIntensity(n)}
                style={[st.quizBtn, { flex: 0, width: 40, height: 40, borderColor: intensity === n ? C.gold : C.b }]}>
                <Text style={[st.quizBtnText, intensity === n && { color: C.gold, fontWeight: '800' }]}>{n}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[st.timerLabel, { marginTop: 8 }]}>Intensitas: {intensity}/10</Text>
          <TouchableOpacity style={[st.startBtn, { backgroundColor: C.gold + '20' }]} onPress={() => setPhase('tunein')}>
            <Text style={[st.startBtnText, { color: C.gold }]}>Lanjut → Tune-In</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* PHASE 2: TUNE-IN */}
      {phase === 'tunein' && (
        <View style={st.seftCard}>
          <Text style={[st.scanArea, { color: C.cyan }]}>2. The Tune-In</Text>
          <Text style={st.scanInstruction}>Pikirkan dan RASAKAN masalah Anda sekarang. Bayangkan peristiwa atau rasa sakit yang spesifik. Benamkan diri dalam perasaan itu sejenak.</Text>
          <View style={st.affirmBox}>
            <Text style={st.affirmLabel}>Sambil merasakan, ucapkan dalam hati:</Text>
            <Text style={[st.affirmText, { color: C.cyan }]}>"Ya Allah, saya ikhlas, saya pasrah pada-Mu."</Text>
          </View>
          <Text style={[st.scanInstruction, { marginTop: 12, color: C.amber }]}>⚠️ Jangan lepaskan perasaan ini selama tapping. Tetap tune-in selama seluruh proses.</Text>
          <TouchableOpacity style={[st.startBtn, { backgroundColor: C.cyan + '20' }]} onPress={() => { setPhase('tapping'); startTapping(); }}>
            <Text style={[st.startBtnText, { color: C.cyan }]}>Mulai Tapping →</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* PHASE 3 & 5: TAPPING */}
      {(phase === 'tapping' || phase === 'tapping2') && running && (
        <View style={st.seftCard}>
          <Text style={[st.scanArea, { color: C.violet, marginBottom: 4 }]}>{phase === 'tapping' ? '3. Tapping Ronde 1' : '5. Tapping Ronde 2'}</Text>
          <Text style={st.scanStep}>{pointIdx + 1} / {tappingPoints.length}</Text>
          
          {/* MACRO ZOOM DETAIL */}
          {tappingPoints[pointIdx].macroImage && (
            <View style={[st.macroContainer, { marginTop: 0 }]}>
              <Image source={tappingPoints[pointIdx].macroImage} style={st.macroImage} resizeMode="cover" />
              <View style={[st.macroLabel, { backgroundColor: C.violet }]}><Text style={st.macroLabelText}>ZOOM DETAIL</Text></View>
            </View>
          )}

          <Text style={{ fontSize: 40, textAlign: 'center', marginBottom: 8, marginTop: tappingPoints[pointIdx].macroImage ? 8 : 0 }}>{tappingPoints[pointIdx].icon}</Text>
          <Text style={[st.scanArea, { color: C.violet, fontSize: 18 }]}>{tappingPoints[pointIdx].name}</Text>
          <Text style={st.scanInstruction}>📍 {tappingPoints[pointIdx].location}</Text>
          <Text style={[st.scanInstruction, { fontWeight: '600', color: C.t1 }]}>{tappingPoints[pointIdx].instruction}</Text>
          <Text style={[st.scanInstruction, { color: C.amber }]}>Ketuk 5-7x sambil terus ucapkan: "Saya ikhlas, saya pasrah…"</Text>
          <View style={[st.scanTimer, { borderColor: C.violet }]}>
            <Text style={[st.scanTimerText, { color: C.violet }]}>{countdown}s</Text>
          </View>
        </View>
      )}

      {/* PHASE 4: 9 GAMUT */}
      {phase === 'gamut' && !running && (
        <View style={st.seftCard}>
          <Text style={[st.scanArea, { color: C.orange }]}>4. The 9 Gamut Procedure</Text>
          <Text style={st.scanInstruction}>Ketuk TERUS di Gamut Spot (punggung tangan, antara tulang jari manis & kelingking) sambil melakukan 9 langkah berikut:</Text>
          <TouchableOpacity style={[st.startBtn, { backgroundColor: C.orange + '20' }]} onPress={startGamut}>
            <Text style={[st.startBtnText, { color: C.orange }]}>▶ Mulai 9 Gamut</Text>
          </TouchableOpacity>
        </View>
      )}

      {phase === 'gamut' && running && (
        <View style={st.seftCard}>
          <Text style={[st.scanArea, { color: C.orange }]}>4. 9 Gamut Procedure</Text>
          <Text style={st.scanStep}>Langkah {gamutIdx + 1} / 9 — TERUS ketuk Gamut Spot!</Text>
          <Text style={{ fontSize: 36, textAlign: 'center', marginBottom: 8 }}>✊</Text>
          <Text style={[st.scanArea, { color: C.orange, fontSize: 18 }]}>{SEFT_9_GAMUT[gamutIdx].instruction}</Text>
          <View style={[st.scanTimer, { borderColor: C.orange }]}>
            <Text style={[st.scanTimerText, { color: C.orange }]}>{countdown}s</Text>
          </View>

        </View>
      )}

      {/* PHASE 6: DONE */}
      {phase === 'done' && (
        <View style={st.seftCard}>
          <Text style={{ fontSize: 48, textAlign: 'center' }}>🙏</Text>
          <Text style={[st.scanArea, { color: C.emerald }]}>SEFT Selesai — Alhamdulillah</Text>
          <Text style={st.scanInstruction}>Tarik napas dalam, hembuskan. Ucap syukur.</Text>

          <Text style={[st.scanInstruction, { marginTop: 16 }]}>Ukur ulang intensitas masalah Anda (0-10):</Text>
          <View style={[st.row, { justifyContent: 'center', flexWrap: 'wrap', gap: 6, marginTop: 8 }]}>
            {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
              <TouchableOpacity key={n} onPress={() => setIntensityAfter(n)}
                style={[st.quizBtn, { flex: 0, width: 40, height: 40, borderColor: intensityAfter === n ? C.emerald : C.b }]}>
                <Text style={[st.quizBtnText, intensityAfter === n && { color: C.emerald, fontWeight: '800' }]}>{n}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {intensityAfter !== null && (
            <View style={[st.affirmBox, { marginTop: 16 }]}>
              <Text style={st.affirmLabel}>Hasil:</Text>
              <Text style={[st.affirmText, { color: intensity - intensityAfter > 0 ? C.emerald : C.amber }]}>
                {intensity}/10 → {intensityAfter}/10 ({intensity - intensityAfter > 0 ? `turun ${intensity - intensityAfter} poin ✅` : intensity === intensityAfter ? 'sama — ulangi 1-2 ronde lagi' : 'naik — ganti kalimat set-up'})
              </Text>
              {intensityAfter > 2 && <Text style={[st.scanInstruction, { color: C.amber, marginTop: 8 }]}>💡 Tips: Jika masih &gt; 2, ulangi SEFT 2-3 ronde hingga turun ke 0-2.</Text>}
            </View>
          )}

          <TouchableOpacity style={st.restartBtn} onPress={() => { setPhase('setup'); setIntensityAfter(null); }}>
            <Text style={st.restartText}>🔄 Ulangi Ronde</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

// --- DISEASE ACUPRESSURE SCREEN ---
const DiseaseAcuScreen = ({ goBack, navigate }) => (
  <ScrollView style={st.screen} contentContainerStyle={{ paddingBottom: 20 }}>
    <BackBtn onPress={goBack} />
    <Text style={st.screenTitle}>🏥 Obati dengan Akupresur</Text>
    <Text style={st.screenSub}>Pilih gangguan Anda → panduan titik akupresur spesifik dengan timer</Text>

    <HeroImage source={require('./assets/acu_guide.png')} />

    <View style={[st.card, { borderLeftColor: C.rose, borderLeftWidth: 4, marginBottom: 16, marginTop: 10 }]}>
      <Text style={[st.toolDesc, { color: C.amber }]}>⚠️ Akupresur adalah terapi KOMPLEMENTER. Untuk kondisi serius, tetap konsultasi dokter. Jangan tekan area luka, meradang, atau varises.</Text>
    </View>

    {DISEASE_ACUPRESSURE.map((d) => (
      <TouchableOpacity key={d.id} style={st.toolCard}
        onPress={() => navigate('diseaseAcuDetail', { diseaseId: d.id })} activeOpacity={0.7}>
        <View style={st.row}>
          <Text style={{ fontSize: 30, marginRight: 14 }}>{d.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={st.toolTitle}>{d.name}</Text>
            <Text style={st.toolDesc}>{d.desc}</Text>
            <Text style={[st.toolDesc, { color: C.emerald }]}>{d.points.length} titik • {d.totalDuration}</Text>
          </View>
          <Text style={[st.actionGo, { color: C.rose }]}>MULAI</Text>
        </View>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

// --- DISEASE ACUPRESSURE DETAIL TOOL ---
const DiseaseAcuDetailTool = ({ diseaseId, goBack }) => {
  const disease = DISEASE_ACUPRESSURE.find(d => d.id === diseaseId) || DISEASE_ACUPRESSURE[0];
  const [pointIdx, setPointIdx] = useState(-1);
  const [countdown, setCountdown] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let t;
    if (running && countdown > 0) {
      t = setInterval(() => setCountdown(c => c - 1), 1000);
    } else if (running && countdown === 0) {
      const nextIdx = pointIdx + 1;
      if (nextIdx < disease.points.length) {
        setPointIdx(nextIdx);
        setCountdown(disease.points[nextIdx].duration);
      } else {
        setRunning(false);
        setPointIdx(disease.points.length);
      }
    }
    return () => clearInterval(t);
  }, [running, countdown, pointIdx, disease]);

  const startSession = () => {
    setPointIdx(0);
    setCountdown(disease.points[0].duration);
    setRunning(true);
  };

  const stopSession = () => setRunning(false);
  const point = disease.points[pointIdx];
  const isDone = pointIdx >= disease.points.length;

  return (
    <ScrollView style={st.screen} contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
      <BackBtn onPress={() => { stopSession(); goBack(); }} />
      
      <HeroImage source={require('./assets/acu_guide.png')} height={220} />

      <Text style={{ fontSize: 44, marginTop: 12 }}>{disease.icon}</Text>
      <Text style={st.screenTitle}>{disease.name}</Text>
      <Text style={st.screenSub}>{disease.points.length} titik akupresur • {disease.totalDuration}</Text>

      {/* Before start — show all points */}
      {pointIdx === -1 && (
        <>
          {disease.points.map((p, i) => (
            <View key={i} style={st.routinePreview}>
              <View style={[st.routineNum, { backgroundColor: C.rose }]}>
                <Text style={st.routineNumText}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={st.routineStepName}>{p.name}</Text>
                <Text style={st.routineStepTime}>📍 {p.location}</Text>
              </View>
            </View>
          ))}
          <View style={[st.affirmBox, { marginTop: 8 }]}>
            <Text style={st.affirmLabel}>🔬 Bukti Ilmiah:</Text>
            <Text style={[st.affirmText, { color: C.cyan, fontSize: 13 }]}>{disease.evidence}</Text>
          </View>
          <TouchableOpacity style={[st.startBtn, { backgroundColor: C.rose + '20' }]} onPress={startSession} activeOpacity={0.7}>
            <Text style={[st.startBtnText, { color: C.rose }]}>▶ Mulai Sesi Penyembuhan</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Active point */}
      {point && running && (
        <View style={st.seftCard}>
          <Text style={st.scanStep}>Titik {pointIdx + 1} / {disease.points.length}</Text>
          <Text style={[st.scanArea, { color: C.rose, marginBottom: 2 }]}>{point.name}</Text>
          
          {/* MACRO ZOOM DETAIL (Dynamic during session) */}
          {point.macroImage && (
            <View style={st.macroContainer}>
              <Image source={point.macroImage} style={st.macroImage} resizeMode="cover" />
              <View style={[st.macroLabel, { backgroundColor: C.rose }]}><Text style={st.macroLabelText}>ZOOM DETAIL</Text></View>
            </View>
          )}

          <Text style={st.scanInstruction}>📍 {point.location}</Text>
          <Text style={[st.scanInstruction, { fontWeight: '600', color: C.t1, marginTop: 8 }]}>{point.technique}</Text>
          <View style={[st.scanTimer, { borderColor: C.rose, marginTop: 16 }]}>
            <Text style={[st.scanTimerText, { color: C.rose }]}>{Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</Text>
          </View>

        </View>
      )}

      {/* Done */}
      {isDone && (
        <View style={st.scanDone}>
          <Text style={{ fontSize: 48, textAlign: 'center' }}>✅</Text>
          <Text style={[st.scanArea, { color: C.emerald }]}>Sesi Selesai!</Text>
          <Text style={st.scanInstruction}>Semua {disease.points.length} titik telah distimulasi. Ulangi 2-3x sehari untuk hasil optimal.</Text>
          <TouchableOpacity style={st.restartBtn} onPress={() => { setPointIdx(-1); setRunning(false); }}>
            <Text style={st.restartText}>🔄 Ulangi Sesi</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

// --- AI CONSULTATION TOOL ---
const ConsultationTool = ({ goBack, navigate, aiConfig, userBio, isAiValidated }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const askAI = async () => {
    if (!input.trim()) return;
    if (!aiConfig.apiKey) {
      Alert.alert('API Key Kosong', 'Atur API Key di Pengaturan untuk menggunakan fitur ini.');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const provider = AI_PROVIDERS[aiConfig.provider];
      const toolsStr = APP_TOOLS_DATA.map(t => `- ${t.name}: ${t.desc} (target: ${t.screen}, params: ${JSON.stringify(t.params)})`).join('\n');
      
      const systemPrompt = `Anda adalah asisten YourBody. Bantu pengguna mengatasi keluhan kesehatan dengan alat yang tersedia di aplikasi ini.
DATA USER: Nama: ${userBio.name || 'User'}, Berat: ${userBio.weight}kg, Tinggi: ${userBio.height}cm.
ALAT TERSEDIA:
${toolsStr}

Berikan respon JSON murni:
{
  "insight": "Penjelasan singkat & empatik (maks 2 kalimat).",
  "recommendations": [
    { "title": "Nama Tool", "desc": "Alasan singkat", "screen": "target_id", "params": {} }
  ]
}`;

      const response = await fetch(`${provider.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${aiConfig.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://yourbody.app',
          'X-Title': 'YourBody AI'
        },
        body: JSON.stringify({
          model: aiConfig.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: input }
          ],
          response_format: { type: 'json_object' }
        })
      });

      const data = await response.json();
      if (response.ok) {
        const content = JSON.parse(data.choices[0].message.content);
        setResult(content);
      } else {
        Alert.alert('Gagal', data.error?.message || 'Cek koneksi AI Anda.');
      }
    } catch (e) {
      Alert.alert('Error', 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={st.screen} contentContainerStyle={{ paddingBottom: 60 }}>
      <BackBtn onPress={goBack} />
      <View style={st.row}>
        <Text style={[st.screenTitle, { flex: 1 }]}>💬 Tanya Tubuh</Text>
        <View style={{ backgroundColor: isAiValidated ? '#00ff8820' : '#ff4b2b20', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: 'center', marginTop: 16 }}>
           <Text style={{ fontSize: 10, fontWeight: '800', color: isAiValidated ? '#00ff88' : '#ff4b2b' }}>
             {isAiValidated ? '🟢 TERHUBUNG' : '🔴 OFFLINE'}
           </Text>
        </View>
      </View>
      <Text style={st.screenSub}>Ceritakan keluhan Anda, AI akan menyarankan praktik yang sesuai.</Text>

      <View style={st.card}>
        <Text style={st.label}>Apa yang Anda rasakan sekarang?</Text>
        <TextInput 
          style={[st.input, { height: 100, textAlignVertical: 'top', paddingTop: 12 }]}
          placeholder="Misal: Saya merasa pusing dan tegang di bahu setelah kerja seharian..."
          placeholderTextColor={C.t3}
          multiline
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity 
          style={[st.startBtn, { marginTop: 10, opacity: loading ? 0.6 : 1 }]} 
          onPress={askAI}
          disabled={loading}
        >
          <Text style={st.startBtnText}>{loading ? 'Menganalisis Tubuh...' : '✨ Analisis & Cari Solusi'}</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <ActivityIndicator size="large" color={C.cyan} />
          <Text style={[st.toolDesc, { marginTop: 10 }]}>Menghubungkan keluhan dengan jalur meridian & bio-hacking...</Text>
        </View>
      )}

      {result && (
        <Animated.View style={{ marginTop: 10 }}>
          <View style={[st.card, { borderLeftColor: C.cyan, borderLeftWidth: 4 }]}>
            <Text style={st.toolTitle}>💡 Analisis AI</Text>
            <Text style={st.toolDesc}>{result.insight}</Text>
          </View>

          <Text style={st.sectionTitle}>🎯 Rekomendasi Praktik</Text>
          {result.recommendations.map((rec, i) => (
            <TouchableOpacity key={i} style={st.toolCard} onPress={() => navigate(rec.screen, rec.params)} activeOpacity={0.7}>
              <View style={st.row}>
                 <View style={{ flex: 1 }}>
                    <Text style={[st.toolTitle, { color: C.cyan }]}>{rec.title}</Text>
                    <Text style={st.toolDesc}>{rec.desc}</Text>
                 </View>
                 <Text style={[st.actionGo, { color: C.cyan }]}>MULAI →</Text>
              </View>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}

      <View style={[st.card, { backgroundColor: C.sl + '40', marginTop: 20 }]}>
         <Text style={st.toolDesc}>• AI YourBody menggunakan context Bio Profil Anda untuk akurasi.{"\n"}• Tetap konsultasi ke dokter untuk kondisi medis darurat.</Text>
      </View>
    </ScrollView>
  );
};

// --- LIST SCREENS ---
const AllBreathingScreen = ({ goBack, navigate }) => (
  <ScrollView style={st.screen} contentContainerStyle={{ paddingBottom: 20 }}>
    <BackBtn onPress={goBack} />
    <Text style={st.screenTitle}>🫁 Pilih Pola Napas</Text>
    {Object.entries(BREATHING_PATTERNS).map(([key, bp]) => (
      <TouchableOpacity key={key} style={[st.toolCard, { borderLeftColor: bp.phases[0].color, borderLeftWidth: 4 }]}
        onPress={() => navigate('breathing', { pattern: key })} activeOpacity={0.7}>
        <Text style={st.toolTitle}>{bp.name}</Text>
        <Text style={st.toolDesc}>{bp.desc}</Text>
        <Text style={[st.actionGo, { color: bp.phases[0].color }]}>MULAI →</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

const AllAcupressureScreen = ({ goBack, navigate }) => (
  <ScrollView style={st.screen} contentContainerStyle={{ paddingBottom: 20 }}>
    <BackBtn onPress={goBack} />
    <Text style={st.screenTitle}>👆 Titik Acupressure</Text>
    <Text style={st.screenSub}>Tekan titik-titik ini untuk penyembuhan mandiri</Text>
    {ACUPRESSURE_POINTS.map((p) => (
      <TouchableOpacity key={p.id} style={st.toolCard} onPress={() => navigate('acupressure', { pointId: p.id })} activeOpacity={0.7}>
        <View style={st.row}>
          <Text style={{ fontSize: 32, marginRight: 14 }}>{p.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={st.toolTitle}>{p.name}</Text>
            <Text style={st.toolDesc}>📍 {p.location}</Text>
            <Text style={[st.toolDesc, { color: C.emerald }]}>🎯 {p.benefit}</Text>
          </View>
          <Text style={[st.actionGo, { color: C.pink }]}>MULAI</Text>
        </View>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

const AllRoutinesScreen = ({ goBack, navigate }) => (
  <ScrollView style={st.screen} contentContainerStyle={{ paddingBottom: 20 }}>
    <BackBtn onPress={goBack} />
    <Text style={st.screenTitle}>🤸 Stretch & Movement</Text>
    
    <HeroImage source={require('./assets/yoga_banner.png')} height={140} />
    {Object.entries(STRETCH_ROUTINES).map(([key, r]) => (
      <TouchableOpacity key={key} style={[st.toolCard, { borderLeftColor: C.orange, borderLeftWidth: 4 }]}
        onPress={() => navigate('routine', { routineId: key })} activeOpacity={0.7}>
        <Text style={st.toolTitle}>{r.name}</Text>
        <Text style={st.toolDesc}>{r.steps.length} gerakan • {Math.round(r.steps.reduce((a, s) => a + s.duration, 0) / 60)} menit</Text>
        <Text style={[st.actionGo, { color: C.orange }]}>MULAI →</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);


// ============================================================
// SHARED COMPONENTS
// ============================================================

const BackBtn = ({ onPress }) => (
  <TouchableOpacity style={st.backBtn} onPress={onPress} activeOpacity={0.7}>
    <Text style={st.backBtnText}>← Kembali</Text>
  </TouchableOpacity>
);

const HeroImage = ({ source, height = 180 }) => (
  <View style={[st.heroContainer, { height }]}>
    <Image source={source} style={st.heroImage} resizeMode="cover" />
    <View style={st.heroOverlay} />
  </View>
);

const SettingsScreen = ({ aiConfig, setAiConfig, userBio, setUserBio, isAiValidated, setIsAiValidated }) => {
  // AI State
  const [provider, setProvider] = useState(AI_PROVIDERS[aiConfig.provider] ? aiConfig.provider : 'openrouter');
  const [model, setModel] = useState(aiConfig.model || 'openrouter/free');
  const [apiKey, setApiKey] = useState(aiConfig.apiKey || '');
  const [testing, setTesting] = useState(false);
  const [testStatus, setTestStatus] = useState(null);

  // Bio State
  const [name, setName] = useState(userBio.name || '');
  const [age, setAge] = useState(userBio.age || '');
  const [weight, setWeight] = useState(userBio.weight || '');
  const [height, setHeight] = useState(userBio.height || '');

  const calculateHealth = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    let bmi = null;
    let water = null;
    if (w && h) bmi = (w / ((h / 100) ** 2)).toFixed(1);
    if (w) water = (w * 0.033).toFixed(1);
    return { bmi, water };
  };

  const { bmi, water } = calculateHealth();
  const bmiStatus = bmi ? (bmi < 18.5 ? { l: 'Kurus', c: C.blue } : bmi < 25 ? { l: 'Ideal', c: C.emerald } : bmi < 30 ? { l: 'Overweight', c: C.amber } : { l: 'Obesitas', c: C.rose }) : null;

  const handleSaveAll = async () => {
    const newAi = { provider, model, apiKey };
    const newBio = { name, age, weight, height };
    try {
      await Promise.all([
        AsyncStorage.setItem('yourbody_ai_config', JSON.stringify(newAi)),
        AsyncStorage.setItem('yourbody_user_bio', JSON.stringify(newBio))
      ]);
      setAiConfig(newAi);
      setUserBio(newBio);
      Alert.alert('Sukses', 'Semua data berhasil disimpan!');
    } catch (e) {
      Alert.alert('Error', 'Gagal menyimpan data.');
    }
  };

  const testConnection = async () => {
    if (!apiKey) return Alert.alert('Peringatan', 'Masukkan API Key terlebih dahulu.');
    setTesting(true); setTestStatus(null);
    try {
      const config = AI_PROVIDERS[provider];
      const response = await fetch(`${config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, messages: [{ role: 'user', content: 'Hi' }], max_tokens: 5 })
      });
      const ok = response.ok;
      setTestStatus(ok ? 'success' : 'error');
      setIsAiValidated(ok);
      if (!ok) {
        const err = await response.json();
        Alert.alert('Gagal', err.error?.message || 'Cek API Key.');
      }
    } catch (e) { setTestStatus('error'); Alert.alert('Error', 'Jaringan bermasalah.'); }
    finally { setTesting(false); }
  };

  return (
    <ScrollView style={st.screen} contentContainerStyle={{ paddingBottom: 120 }}>
      <Text style={st.screenTitle}>⚙️ Pengaturan</Text>
      <Text style={st.screenSub}>Kelola profil fisik & konfigurasi AI Anda.</Text>

      {/* BIO PROFILE SECTION */}
      <Text style={st.sectionTitle}>👤 Bio Profil</Text>
      <View style={st.card}>
        <View style={st.row}>
           <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={st.label}>Nama Panggilan</Text>
              <TextInput style={st.input} value={name} onChangeText={setName} placeholder="Budi..." placeholderTextColor={C.t3} />
           </View>
           <View style={{ width: 80 }}>
              <Text style={st.label}>Umur</Text>
              <TextInput style={st.input} value={age} onChangeText={setAge} keyboardType="numeric" placeholder="25" placeholderTextColor={C.t3} />
           </View>
        </View>

        <View style={st.row}>
           <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={st.label}>Berat (kg)</Text>
              <TextInput style={st.input} value={weight} onChangeText={setWeight} keyboardType="numeric" placeholder="70" placeholderTextColor={C.t3} />
           </View>
           <View style={{ flex: 1 }}>
              <Text style={st.label}>Tinggi (cm)</Text>
              <TextInput style={st.input} value={height} onChangeText={setHeight} keyboardType="numeric" placeholder="170" placeholderTextColor={C.t3} />
           </View>
        </View>

        {/* HEALTH METRICS PREVIEW */}
        {(bmi || water) && (
          <View style={[st.row, { marginTop: 10, gap: 10 }]}>
            {bmi && (
              <View style={[st.flex1, { backgroundColor: C.bg, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: bmiStatus.c }]}>
                <Text style={{ fontSize: 10, color: C.t3, fontWeight: '700' }}>BMI ANDA</Text>
                <Text style={{ fontSize: 18, fontWeight: '800', color: bmiStatus.c }}>{bmi}</Text>
                <Text style={{ fontSize: 11, color: bmiStatus.c, fontWeight: '600' }}>{bmiStatus.l}</Text>
              </View>
            )}
            {water && (
              <View style={[st.flex1, { backgroundColor: C.bg, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: C.cyan }]}>
                <Text style={{ fontSize: 10, color: C.t3, fontWeight: '700' }}>TARGET AIR</Text>
                <Text style={{ fontSize: 18, fontWeight: '800', color: C.cyan }}>{water}L</Text>
                <Text style={{ fontSize: 11, color: C.t2 }}>Harian</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* AI SECTION */}
      <Text style={st.sectionTitle}>🧠 Konfigurasi AI</Text>
      <View style={st.card}>
        <Text style={st.label}>AI Provider</Text>
        <View style={st.btnGroup}>
          {Object.keys(AI_PROVIDERS).map(p => (
            <TouchableOpacity 
              key={p} 
              style={[st.choiceBtn, provider === p && st.choiceBtnActive]}
              onPress={() => {
                setProvider(p);
                setModel(AI_PROVIDERS[p].models[0]);
              }}
            >
              <Text style={[st.choiceBtnText, provider === p && st.choiceBtnTextActive]}>
                {AI_PROVIDERS[p].name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[st.label, { marginTop: 20 }]}>Pilih Model</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
          {(AI_PROVIDERS[provider]?.models || []).map(m => (
            <TouchableOpacity 
              key={m} 
              style={[st.modelBadge, model === m && st.modelBadgeActive]}
              onPress={() => setModel(m)}
            >
              <Text style={[st.modelBadgeText, model === m && st.modelBadgeTextActive]}>{m}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={[st.label, { marginTop: 10 }]}>API Key</Text>
        <TextInput 
          style={st.input}
          placeholder="sk-..."
          placeholderTextColor={C.t3}
          value={apiKey}
          onChangeText={setApiKey}
          secureTextEntry
        />

        <TouchableOpacity 
          style={[st.testBtn, testing && { opacity: 0.6 }, testStatus === 'success' && st.testBtnSuccess, testStatus === 'error' && st.testBtnError]} 
          onPress={testConnection}
          disabled={testing}
        >
          <Text style={[st.testBtnText, testStatus === 'success' && { color: '#00ff88' }, testStatus === 'error' && { color: '#ff4b2b' }]}>
            {testing ? 'Mengetes...' : testStatus === 'success' ? '✅ Koneksi Terverifikasi' : testStatus === 'error' ? '❌ Koneksi Gagal' : '⚡ Test Koneksi AI'}
          </Text>
        </TouchableOpacity>

        {testStatus && (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: -4, marginBottom: 16 }}>
             <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: testStatus === 'success' ? '#00ff88' : '#ff4b2b', marginRight: 8 }} />
             <Text style={{ fontSize: 12, fontWeight: '700', color: testStatus === 'success' ? '#00ff88' : '#ff4b2b' }}>
               {testStatus === 'success' ? 'SISTEM SIAP DIGUNAKAN' : 'SISTEM OFFLINE'}
             </Text>
          </View>
        )}

        <TouchableOpacity style={st.saveBtn} onPress={handleSaveAll}>
          <Text style={st.saveBtnText}>💾 Simpan Pengaturan</Text>
        </TouchableOpacity>
      </View>

      <Text style={[st.toolDesc, { textAlign: 'center', marginTop: 10, opacity: 0.5 }]}>
        YourBody v2.0.0-AI (Stable)
      </Text>

      <View style={[st.card, { backgroundColor: C.sl + '40' }]}>
        <Text style={st.toolTitle}>💡 Tips</Text>
        <Text style={st.toolDesc}>
          • Gunakan OpenRouter untuk akses model gratis (openrouter/free).{"\n"}
          • AI Key Anda disimpan aman secara lokal di HP ini.{"\n"}
          • Setelah terhubung, YourBody akan memiliki "kesadaran" untuk membimbing sesi Anda.
        </Text>
      </View>
    </ScrollView>
  );
};

const BottomNav = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', icon: '🏠', label: 'Sekarang' },
    { id: 'practice', icon: '🛠️', label: 'Praktik' },
    { id: 'discover', icon: '🔬', label: 'Temukan' },
    { id: 'wisdom', icon: '💎', label: 'Wisdom' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ];
  return (
    <View style={st.bottomNav}>
      {tabs.map((t) => (
        <TouchableOpacity key={t.id} style={st.navItem} onPress={() => setActiveTab(t.id)} activeOpacity={0.7}>
          <Text style={st.navIcon}>{t.icon}</Text>
          <Text style={[st.navLabel, activeTab === t.id && st.navLabelActive]}>{t.label}</Text>
          {activeTab === t.id && <View style={st.navDot} />}
        </TouchableOpacity>
      ))}
    </View>
  );
};

// ============================================================
// STYLES
// ============================================================

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  flex1: { flex: 1 },
  screen: { flex: 1, paddingHorizontal: 20 },
  row: { flexDirection: 'row', alignItems: 'center' },

  header: { paddingTop: 16, marginBottom: 20 },
  greeting: { fontSize: 12, color: C.t3, letterSpacing: 2, fontWeight: '700' },
  appTitle: { fontSize: 26, fontWeight: '800', color: C.t1, marginTop: 6 },
  timeText: { fontSize: 28, fontWeight: '800', color: C.t1 },

  card: { backgroundColor: C.s, borderRadius: 18, padding: 18, marginBottom: 14 },
  h2: { fontSize: 18, fontWeight: '700' },
  badge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 13, fontWeight: '700' },

  sectionTitle: { fontSize: 18, fontWeight: '700', color: C.t1, marginTop: 8, marginBottom: 14 },
  screenTitle: { fontSize: 26, fontWeight: '800', color: C.t1, marginTop: 16, marginBottom: 6 },
  screenSub: { fontSize: 14, color: C.t2, lineHeight: 21, marginBottom: 20 },

  // Action Cards
  actionCard: { backgroundColor: C.s, borderRadius: 16, padding: 16, marginBottom: 10 },
  actionCardDone: { opacity: 0.5 },
  actionTitle: { fontSize: 15, fontWeight: '700', color: C.t1 },
  actionDesc: { fontSize: 12, color: C.t3, marginTop: 2 },
  actionDuration: { fontSize: 11, color: C.t3, marginBottom: 4 },
  actionGo: { fontSize: 12, fontWeight: '800' },
  textStrike: { textDecorationLine: 'line-through', color: C.t3 },

  // Quick Grid
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  quickBtn: { width: '31%', backgroundColor: C.s, borderRadius: 14, padding: 14, alignItems: 'center', marginBottom: 10 },
  quickLabel: { fontSize: 11, color: C.t2, marginTop: 6, fontWeight: '600' },

  // Tools
  toolCard: { backgroundColor: C.s, borderRadius: 16, padding: 18, marginBottom: 12 },
  toolTitle: { fontSize: 16, fontWeight: '700', color: C.t1 },
  toolDesc: { fontSize: 13, color: C.t2, marginTop: 4, lineHeight: 20 },
  toolBadge: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 5 },
  toolBadgeText: { fontSize: 12, fontWeight: '700' },

  // Discover
  discoverCard: { backgroundColor: C.s, borderRadius: 16, padding: 18, marginBottom: 10 },
  discoverTitle: { fontSize: 16, fontWeight: '700', color: C.t1 },
  discoverExpanded: { marginTop: 14, borderTopWidth: 1, borderTopColor: C.b, paddingTop: 14 },
  discoverInsight: { fontSize: 14, color: C.t2, lineHeight: 22, marginBottom: 14 },
  discoverAction: { borderRadius: 12, padding: 14, alignItems: 'center' },
  discoverActionText: { fontSize: 14, fontWeight: '700' },
  expandIcon: { fontSize: 12, color: C.t3, marginLeft: 8 },

  // Breathing
  breathCircle: { width: 200, height: 200, borderRadius: 100, backgroundColor: C.sl, borderWidth: 3, justifyContent: 'center', alignItems: 'center', marginVertical: 24 },
  breathMainText: { fontSize: 18, fontWeight: '700', textAlign: 'center' },
  breathCountdown: { fontSize: 36, fontWeight: '800', color: C.t1, marginTop: 4 },
  breathCycle: { fontSize: 13, color: C.t3, marginTop: 4 },
  breathHint: { fontSize: 13, color: C.t3, marginTop: 8 },
  restartBtn: { marginTop: 16, paddingVertical: 12, paddingHorizontal: 24, backgroundColor: C.sl, borderRadius: 12 },
  restartText: { fontSize: 14, fontWeight: '600', color: C.cyan },
  phaseList: { width: '100%', marginTop: 20 },
  phaseListTitle: { fontSize: 14, fontWeight: '700', color: C.t2, marginBottom: 10 },
  phaseItem: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 10, marginBottom: 4 },
  phaseDot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  phaseItemText: { fontSize: 14, color: C.t2 },

  // Timer
  timerCircle: { width: 200, height: 200, borderRadius: 100, backgroundColor: C.sl, borderWidth: 4, borderColor: C.cyan, justifyContent: 'center', alignItems: 'center', marginVertical: 24 },
  timerText: { fontSize: 36, fontWeight: '800', color: C.t1 },
  timerLabel: { fontSize: 13, color: C.t3, marginTop: 6 },
  progressBar: { width: '100%', height: 6, backgroundColor: C.sl, borderRadius: 3 },
  progressFill: { height: 6, borderRadius: 3 },

  // Body Scan
  scanCard: { width: '100%', backgroundColor: C.s, borderRadius: 20, padding: 24, alignItems: 'center', marginTop: 20 },
  scanStep: { fontSize: 13, color: C.t3, marginBottom: 8 },
  scanArea: { fontSize: 22, fontWeight: '700', color: C.t1, textAlign: 'center', marginBottom: 12 },
  scanInstruction: { fontSize: 15, color: C.t2, lineHeight: 24, textAlign: 'center', marginBottom: 16 },
  scanTimer: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  scanTimerText: { fontSize: 24, fontWeight: '800' },
  scanDone: { width: '100%', backgroundColor: C.s, borderRadius: 20, padding: 24, alignItems: 'center', marginTop: 20 },

  posisiBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.sl, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, marginBottom: 16 },
  posisiLabel: { fontSize: 10, fontWeight: '800', color: C.t3, marginRight: 8 },
  posisiText: { fontSize: 12, fontWeight: '700', color: C.cyan },

  // Start/Stop Buttons
  startBtn: { backgroundColor: C.cyan + '20', borderRadius: 16, padding: 18, alignItems: 'center', width: '100%', marginTop: 20 },
  startBtnText: { fontSize: 16, fontWeight: '700', color: C.cyan },
  stopBtn: { backgroundColor: C.rose + '20', borderRadius: 16, padding: 16, alignItems: 'center', width: '100%', marginTop: 16 },
  stopBtnText: { fontSize: 15, fontWeight: '700', color: C.rose },

  // Routines
  routinePreview: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, width: '100%' },
  routineNum: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  routineNumText: { fontSize: 14, fontWeight: '700', color: C.bg },
  routineStepName: { fontSize: 15, fontWeight: '600', color: C.t1 },
  routineStepTime: { fontSize: 12, color: C.t3 },
  routineActive: { width: '100%', backgroundColor: C.s, borderRadius: 20, padding: 24, alignItems: 'center', marginTop: 20 },
  routineActiveStep: { fontSize: 13, color: C.t3, marginBottom: 8 },
  routineActiveName: { fontSize: 22, fontWeight: '700', color: C.t1, marginBottom: 12 },
  routineActiveInstruction: { fontSize: 15, color: C.t2, lineHeight: 24, textAlign: 'center', marginBottom: 16 },

  // Acupressure
  acuCard: { width: '100%', backgroundColor: C.s, borderRadius: 16, padding: 20, marginVertical: 16 },
  acuBenefit: { fontSize: 14, color: C.emerald, marginBottom: 12, lineHeight: 22 },
  acuInstruction: { fontSize: 15, color: C.t2, lineHeight: 24 },

  // Cold
  coldCircle: { width: 200, height: 200, borderRadius: 100, backgroundColor: C.sl, borderWidth: 4, borderColor: C.blue, justifyContent: 'center', alignItems: 'center', marginVertical: 24 },
  coldEmoji: { fontSize: 40, marginBottom: 8 },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 16 },
  weekBtn: { flex: 1, backgroundColor: C.s, borderRadius: 12, padding: 12, alignItems: 'center', marginHorizontal: 4, borderWidth: 1, borderColor: C.b },
  weekBtnText: { fontSize: 12, fontWeight: '600', color: C.t2 },
  weekBtnDur: { fontSize: 11, color: C.t3, marginTop: 2 },

  // Fasting
  fastingCircle: { width: 220, height: 220, borderRadius: 110, backgroundColor: C.sl, borderWidth: 4, justifyContent: 'center', alignItems: 'center', marginVertical: 24 },
  fastingTime: { fontSize: 32, fontWeight: '800' },
  fastingPhase: { fontSize: 16, fontWeight: '700', marginTop: 4 },
  fastingDesc: { fontSize: 12, color: C.t3, marginTop: 4, textAlign: 'center', paddingHorizontal: 16 },
  fastingPhases: { width: '100%', marginTop: 16 },
  fastPhaseItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10, marginBottom: 4 },
  fastPhaseH: { fontSize: 13, color: C.t3, width: 55 },
  fastPhaseLabel: { fontSize: 14, color: C.t2, fontWeight: '600' },

  progressBox: { width: '100%', marginTop: 24, backgroundColor: C.s, borderRadius: 16, padding: 16 },
  progressLabel: { fontSize: 12, fontWeight: '700', color: C.t2, flex: 1 },
  progressPct: { fontSize: 13, fontWeight: '800' },

  // Chakra Quiz
  quizCard: { backgroundColor: C.s, borderRadius: 16, padding: 18, marginBottom: 10 },
  quizQ: { fontSize: 15, color: C.t1, lineHeight: 22, marginBottom: 12 },
  quizBtns: { flexDirection: 'row', gap: 10 },
  quizBtn: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: C.b },
  quizBtnText: { fontSize: 14, fontWeight: '600', color: C.t2 },
  quizResult: { backgroundColor: C.s, borderRadius: 20, padding: 24, alignItems: 'center', marginTop: 12 },
  chakraResultCard: { backgroundColor: C.s, borderRadius: 16, padding: 18, marginBottom: 14 },
  chakraResultName: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  chakraResultPractice: { fontSize: 15, fontWeight: '600', color: C.t1, marginBottom: 10 },
  chakraStep: { flexDirection: 'row', marginBottom: 8, alignItems: 'flex-start' },
  chakraStepNum: { fontSize: 14, color: C.t3, marginRight: 8, fontWeight: '600' },
  chakraStepText: { fontSize: 14, color: C.t2, lineHeight: 21, flex: 1 },
  chakraPracticeSteps: { width: '100%', marginTop: 16 },
  affirmBox: { backgroundColor: C.sl, borderRadius: 14, padding: 16, marginTop: 14, width: '100%' },
  affirmLabel: { fontSize: 13, color: C.t3, marginBottom: 6 },
  affirmText: { fontSize: 16, fontWeight: '600', fontStyle: 'italic', lineHeight: 24 },

  // Wisdom
  wisdomHighlight: { backgroundColor: C.s, borderRadius: 24, padding: 24, marginBottom: 20, borderWidth: 1 },
  wisdomText: { fontSize: 17, color: C.t1, lineHeight: 28, textAlign: 'center', fontWeight: '500' },
  wisdomAction: { borderRadius: 14, padding: 14, alignItems: 'center', marginTop: 16 },
  wisdomActionText: { fontSize: 14, fontWeight: '700' },
  wisdomCard: { backgroundColor: C.s, borderRadius: 14, padding: 14, marginBottom: 8, flexDirection: 'row', alignItems: 'flex-start' },
  wisdomCardText: { fontSize: 14, color: C.t2, lineHeight: 22, marginBottom: 6 },
  wisdomCardAction: { fontSize: 13, fontWeight: '700' },

  // Back & Nav
  heroContainer: { width: '100%', borderRadius: 20, overflow: 'hidden', marginBottom: 16 },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(6, 8, 26, 0.3)' },
  backBtn: { marginTop: 12, marginBottom: 4, alignSelf: 'flex-start', paddingVertical: 8, paddingRight: 16 },
  backBtnText: { fontSize: 15, color: C.cyan, fontWeight: '600' },
  bottomNav: { flexDirection: 'row', backgroundColor: C.s, borderTopWidth: 1, borderTopColor: C.b, paddingBottom: Platform.OS === 'ios' ? 20 : 8, paddingTop: 8 },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 6 },
  navIcon: { fontSize: 22, marginBottom: 3 },
  navLabel: { fontSize: 10, color: C.t3, fontWeight: '500' },
  navLabelActive: { color: C.cyan, fontWeight: '700' },
  navDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: C.cyan, marginTop: 3 },

  // SEFT
  seftCard: { width: '100%', backgroundColor: C.s, borderRadius: 20, padding: 24, alignItems: 'center', marginTop: 12 },

  // Macro Detail Global
  macroContainer: { width: '100%', height: 220, borderRadius: 18, overflow: 'hidden', marginVertical: 16, backgroundColor: C.bg, borderWidth: 2, borderColor: C.b },
  macroImage: { width: '100%', height: '100%' },
  macroLabel: { position: 'absolute', top: 12, right: 12, backgroundColor: C.cyan, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  macroLabelText: { fontSize: 9, fontWeight: '800', color: C.bg, letterSpacing: 1 },

  // Settings
  label: { fontSize: 13, color: C.t2, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  btnGroup: { flexDirection: 'row', gap: 10 },
  choiceBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: C.sl, alignItems: 'center', borderWidth: 1, borderColor: C.b },
  choiceBtnActive: { backgroundColor: C.cyan, borderColor: C.cyan },
  choiceBtnText: { fontSize: 14, fontWeight: '700', color: C.t2 },
  choiceBtnTextActive: { color: C.bg },
  modelBadge: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: C.sl, marginRight: 8, borderWidth: 1, borderColor: C.b },
  modelBadgeActive: { backgroundColor: C.cyan + '20', borderColor: C.cyan },
  modelBadgeText: { fontSize: 13, color: C.t2, fontWeight: '600' },
  modelBadgeTextActive: { color: C.cyan },
  input: { backgroundColor: C.bg, borderRadius: 12, padding: 14, color: C.t1, fontSize: 14, marginBottom: 20, borderWidth: 1, borderColor: C.b },
  testBtn: { paddingVertical: 14, borderRadius: 14, backgroundColor: C.sl, alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: 'transparent' },
  testBtnSuccess: { borderColor: '#00ff88', backgroundColor: '#00ff8810' },
  testBtnError: { borderColor: '#ff4b2b', backgroundColor: '#ff4b2b10' },
  testBtnText: { color: C.cyan, fontWeight: '700', fontSize: 14 },
  saveBtn: { paddingVertical: 16, borderRadius: 16, backgroundColor: C.cyan, alignItems: 'center' },
  saveBtnText: { color: C.bg, fontWeight: '800', fontSize: 15 },
});
