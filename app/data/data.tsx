import type { Song } from "../type/song";


const mockSongs: Song[] = [
  {
    id: 1,
    title: "Ramadan",
    artist: "Maher Zain",
    album: "Ramadan",
    duration: "5:07",
    coverUrl: "/images/Remedan_maher.png",
    audioUrl: "https://archive.org/download/maher-zain-ramadan-english-official-music-video-48k/Maher_Zain_-_Ramadan__English____Official_Music_Video%2848k%29.mp3",

  },
  {
    id: 2,
    title: "علي بلد المحبوب",
    artist: "علي أبو الدهب الأسواني",
    album: "علي بلد المحبوب",
    duration: "5:07",
    coverUrl: "/images/ala-beledil-mehbub.jpg",
    audioUrl: "/audio/ala-beledil-mehbub.mp3",

  },
  {
    id: 3,
    title: "Thank You Allah",
    artist: "Maher Zain",
    album: "Thank You Allah",
    duration: "6:25",
    coverUrl: "/images/thankyou_maher.png",
    audioUrl: "https://archive.org/download/maher-zain-ramadan-english-official-music-video-48k/Maher_Zain_-_Thank_You_Allah___Official_Lyric_Video%2848k%29.mp3"
  },
  {
    id: 4,
    title: "Ya Nabi Salam Alayka",
    artist: "Maher Zain",
    album: "Ya Nabi Salam Alayka",
    duration: "5:36",
    coverUrl: "/images/yanebi_maher.png",
    audioUrl: "https://archive.org/download/maher-zain-ramadan-english-official-music-video-48k/Maher_Zain_-_Ya_Nabi_Salam_Alayka__Arabic____%D9%85%D8%A7%D9%87%D8%B1_%D8%B2%D9%8A%D9%86_-_%D9%8A%D8%A7_%D9%86%D8%A8%D9%8A_%D8%B3%D9%84%D8%A7%D9%85_%D8%B9%D9%84%D9%8A%D9%83___Official_Music_Video%2848k%29.mp3",
  },
  {
    id: 5,
    title: "Fiyyashiyya",
    artist: "Sami Yusuf",
    album: "Fiyyashiyya",
    duration: "6:10",
    coverUrl: "/images/fiyashiy_sami.png",
    audioUrl: "https://archive.org/download/maher-zain-ramadan-english-official-music-video-48k/Sami_Yusuf_-_Fiyyashiyya_%23worldmusic_%23worldmusictraditions%2848k%29.mp3",
  },
  {
    id: 6,
    title: "Ilahana",
    artist: "Sami Yusuf",
    album: "Ilahana",
    duration: "4:15",
    coverUrl: "/images/ilahana_sami.png",
    audioUrl: "https://archive.org/download/maher-zain-ramadan-english-official-music-video-48k/Sami_Yusuf_-_Ilahana___%D8%A5%D9%84%D9%87%D9%86%D8%A7_%D9%85%D8%A7_%D8%A3%D8%B9%D8%AF%D9%84%D9%83__%23worldmusic_%23worldmusictraditions%2848k%29.mp3"
  },
  {
    id: 7,
    title: "Madad (Nasimi Arabic Version)",
    artist: "Sami Yusuf",
    album: "Madad",
    duration: "6:40",
    coverUrl: "/images/maded_sami.png",
    audioUrl: "https://archive.org/download/maher-zain-ramadan-english-official-music-video-48k/Sami_Yusuf_-_Madad__Nasimi_Arabic_Version__%23worldmusic_%23worldmusictraditions%2848k%29.mp3"
  },
  {
    id: 8,
    title: "Mast Qalandar (Live)",
    artist: "Sami Yusuf",
    album: "Mast Qalandar",
    duration: "7:07",
    coverUrl: "/images/qalander_sami.png",
    audioUrl: "https://archive.org/download/maher-zain-ramadan-english-official-music-video-48k/Sami_Yusuf_-_Mast_Qalandar__Live__%23worldmusictraditions%2848k%29.mp3"
  },
  {
    id: 9,
    title: "Mawlana (Live in New Delhi)",
    artist: "Sami Yusuf",
    album: "Mawlana",
    duration: "4:13",
    coverUrl: "/images/mewlana_sami.png",
    audioUrl: "https://archive.org/download/maher-zain-ramadan-english-official-music-video-48k/Sami_Yusuf_-_Mawlana__Live_in_New_Delhi%2C_INDIA__%23worldmusic_%23worldmusictraditions%2848k%29.mp3"
  },
  {
    id: 10,
    title: "Taha",
    artist: "Sami Yusuf",
    album: "Taha",
    duration: "5:22",
    coverUrl: "/images/taha_sami.png",
    audioUrl: "https://ia600406.us.archive.org/9/items/maher-zain-ramadan-english-official-music-video-48k/Sami_Yusuf_-_Taha_%23worldmusic_%23worldmusictraditions%2848k%29.mp3"
  },
  {
    id: 11,
    title: "Hamziyya",
    artist: "Sami Yusuf",
    album: "Hamziyya",
    duration: "2:22",
    coverUrl: "/images/hamziya_sami.png",
    audioUrl: "https://archive.org/download/maher-zain-ramadan-english-official-music-video-48k/Sami_Yusuf_%E2%80%93_Hamziyya_%23worldmusic%2848k%29.mp3"
  },
  {
    id: 12,
    title: "Mohamed Nabina",
    artist: "Hamada Helal",
    album: "Mohamed Nabina",
    duration: "4:36",
    coverUrl: "/images/muhammed_halal.png",
    audioUrl: "https://archive.org/download/huwa-ahmadun-malak-fathi-48k/Hamada_Helal_-_Mohamed_Nabina___%D8%AD%D9%85%D8%A7%D8%AF%D8%A9_%D9%87%D9%84%D8%A7%D9%84_-_%D9%85%D8%AD%D9%85%D8%AF_%D9%86%D8%A8%D9%8A%D9%86%D8%A7%2848k%29.mp3"
  },
  {
    id: 13,
    title: "Salam Alaikum",
    artist: "Harris J",
    album: "Salam",
    duration: "3:21",
    coverUrl: "/images/aselamu-aleykum_harris.png",
    audioUrl: "https://archive.org/download/huwa-ahmadun-malak-fathi-48k/Harris_J_-_Salam_Alaikum__Lyrics_%2848k%29.mp3"
  },
  {
    id: 14,
    title: "Baraka Allahu Lakuma",
    artist: "Maher Zain",
    album: "Baraka Allahu Lakuma",
    duration: "5:24",
    coverUrl: "/images/barekelahulekuma_maher.png",
    audioUrl: "https://archive.org/download/huwa-ahmadun-malak-fathi-48k/Maher_Zain_-_Baraka_Allahu_Lakuma___Official_Lyric_Video___%D9%85%D8%A7%D9%87%D8%B1_%D8%B2%D9%8A%D9%86_-_%D8%A8%D8%A7%D8%B1%D9%83_%D8%A7%D9%84%D9%84%D9%87_%D9%84%D9%83%D9%85%D8%A7%2848k%29.mp3"
  },
  {
    id: 15,
    title: "Huwa AlQuran",
    artist: "Maher Zain",
    album: "Huwa AlQuran",
    duration: "4:32",
    coverUrl: "/images/huwa-alquran_maher.png",
    audioUrl: "https://archive.org/download/huwa-ahmadun-malak-fathi-48k/Maher_Zain_-_Huwa_AlQuran___%D9%85%D8%A7%D9%87%D8%B1_%D8%B2%D9%8A%D9%86_-_%D9%87%D9%88_%D8%A7%D9%84%D9%82%D8%B1%D8%A2%D9%86___Official_Music_Video%2848k%29.mp3"
  },
  {
    id: 16,
    title: "Insha Allah (Arabic)",
    artist: "Maher Zain",
    album: "Insha Allah",
    duration: "4:47",
    coverUrl: "/images/inshallah_maher.png",
    audioUrl: "https://dn720709.ca.archive.org/0/items/huwa-ahmadun-malak-fathi-48k/Maher_Zain_-_Insha_Allah__Arabic____%D9%85%D8%A7%D9%87%D8%B1_%D8%B2%D9%8A%D9%86_-_%D8%A5%D9%86_%D8%B4%D8%A7%D8%A1_%D8%A7%D9%84%D9%84%D9%87___Official_Music_Video%2848k%29.mp3"
  },
  {
    id: 17,
    title: "Mawlaya (Arabic)",
    artist: "Maher Zain",
    album: "Mawlaya",
    duration: "4:50",
    coverUrl: "/images/mawlaya_maher.png",
    audioUrl: "https://archive.org/download/huwa-ahmadun-malak-fathi-48k/Maher_Zain_-_Mawlaya__Arabic____%D9%85%D8%A7%D9%87%D8%B1_%D8%B2%D9%8A%D9%86_-_%D9%85%D9%88%D9%84%D8%A7%D9%8A%2848k%29.mp3"
  },
  {
    id: 18,
    title: "Muhammad (Pbuh) Waheshna",
    artist: "Maher Zain",
    album: "Muhammad (Pbuh) Waheshna",
    duration: "4:34",
    coverUrl: "/images/muhammed_maher.png",
    audioUrl: "https://archive.org/download/huwa-ahmadun-malak-fathi-48k/Maher_Zain_-_Muhammad__Pbuh__Waheshna___%D9%85%D8%A7%D9%87%D8%B1_%D8%B2%D9%8A%D9%86_-_%D9%85%D8%AD%D9%85%D8%AF__%D8%B5__%D9%88%D8%A7%D8%AD%D8%B4%D9%86%D8%A7___Official_Music_Video%2848k%29.mp3"
  },
  {
    id: 19,
    title: "Number One For Me",
    artist: "Maher Zain",
    album: "Number One For Me",
    duration: "6:20",
    coverUrl: "/images/numberOneForMe_maher.png",
    audioUrl: "https://archive.org/download/huwa-ahmadun-malak-fathi-48k/Maher_Zain_-_Number_One_For_Me__Official_Music_Video_%2848k%29.mp3"
  },
  {
    id: 20,
    title: "Radhitu Billahi Rabba (Arabic)",
    artist: "Maher Zain",
    album: "Radhitu Billahi Rabba",
    duration: "4:52",
    coverUrl: "/images/radithu-bilahi_maher.png",
    audioUrl: "https://archive.org/download/huwa-ahmadun-malak-fathi-48k/Maher_Zain_-_Radhitu_Billahi_Rabba__Arabic____%D9%85%D8%A7%D9%87%D8%B1_%D8%B2%D9%8A%D9%86_-_%D8%B1%D8%B6%D9%8A%D8%AA_%D8%A8%D8%A7%D9%84%D9%84%D9%87_%D8%B1%D8%A8%D8%A7__Lyric_Video_%2848k%29.mp3"
  },
  {
    id: 21,
    title: "Qalbi Fil Madinah",
    artist: "Maher Zain & Harris J",
    album: "Qalbi Fil Madinah",
    duration: "4:07",
    coverUrl: "/images/qalbi-fil-medina_maher.png",
    audioUrl: "https://archive.org/download/huwa-ahmadun-malak-fathi-48k/Maher_Zain___Harris_J_-_Qalbi_Fil_Madinah___Official_Music_Video___%D9%82%D9%84%D8%A8%D9%8A_%D9%81%D9%8A_%D8%A7%D9%84%D9%85%D8%AF%D9%8A%D9%86%D8%A9%2848k%29.mp3"
  },
  {
    id: 22,
    title: "Areftul Hawa (Live in Morocco)",
    artist: "Sami Yusuf",
    album: "Areftul Hawa",
    duration: "2:44",
    coverUrl: "/images/areftil-hawa_sami.png",
    audioUrl: "https://dn710400.ca.archive.org/0/items/sami-yusuf-ya-hayyu-ya-qayyum-feat.-abida-parveen-official-audio-worldmusic-48k/Sami_Yusuf_-_%D8%B9%D8%B1%D9%81%D8%AA_%D8%A7%D9%84%D9%87%D9%88%D9%89_%D9%85%D8%B0_%D8%B9%D8%B1%D9%81%D8%AA_%D9%87%D9%88%D8%A7%D9%83__Live_in_Morocco__%23worldmusic%2848k%29.mp3"
  },
  {
    id: 23,
    title: "You Came To Me",
    artist: "Sami Yusuf",
    album: "You Came To Me",
    duration: "4:00",
    coverUrl: "/images/you_came_to_me_sami.png",
    audioUrl: "https://archive.org/download/sami-yusuf-ya-hayyu-ya-qayyum-feat.-abida-parveen-official-audio-worldmusic-48k/Sami_Yusuf__-_You_Came_To_Me___%D8%B3%D8%A7%D9%85%D9%8A_%D9%8A%D9%88%D8%B3%D9%81_-_%D8%A3%D8%AA%D9%8A%D8%AA%D9%86%D9%8A__%D8%A7%D9%84%D9%86%D8%B3%D8%AE%D8%A9_%D8%A7%D9%84%D8%B9%D8%B1%D8%A8%D9%8A%D8%A9_%23worldmusic%2848k%29.mp3"
  },
  {
    id: 24,
    title: "Ya Hayyu Ya Qayyum (feat. Abida Parveen)",
    artist: "Sami Yusuf",
    album: "Ya Hayyu Ya Qayyum",
    duration: "5:18",
    coverUrl: "/images/yahay-yaqeyum_sami.png",
    audioUrl: "https://archive.org/download/sami-yusuf-ya-hayyu-ya-qayyum-feat.-abida-parveen-official-audio-worldmusic-48k/Sami_Yusuf_%E2%80%93_Ya_Hayyu_Ya_Qayyum__feat._Abida_Parveen____Official_Audio_%23worldmusic%2848k%29.mp3"
  },
  {
    id: 25,
    title: "Ya Rasul Allah (Türkçe Versiyonu)",
    artist: "Sami Yusuf",
    album: "Ya Rasul Allah",
    duration: "4:02",
    coverUrl: "/images/yaresulelah_sami.png",
    audioUrl: "https://archive.org/download/sami-yusuf-ya-hayyu-ya-qayyum-feat.-abida-parveen-official-audio-worldmusic-48k/Sami_Yusuf_%E2%80%93_Ya_Rasul_Allah_%5BT%C3%BCrk%C3%A7e_Versiyonu%5D__B%C3%B6l%C3%BCm_I__%23worldmusic%2848k%29.mp3"
  },
  {
    id: 26,
    title: "Qamaron",
    artist: "Malak Fathi",
    album: "Qamaron",
    duration: "3:59",
    coverUrl: "/images/qamarun.png",
    audioUrl: "https://archive.org/download/sami-yusuf-ya-hayyu-ya-qayyum-feat.-abida-parveen-official-audio-worldmusic-48k/%D9%82%D9%85%D8%B1_%D8%B3%D9%8A%D8%AF%D9%86%D8%A7_%D8%A7%D9%84%D9%86%D8%A8%D9%8A___%D8%A8%D8%B5%D9%88%D8%AA_%D9%85%D9%84%D8%A7%D9%83_%D9%81%D8%AA%D8%AD%D9%8A___%D9%85%D9%86_%D8%A3%D8%B1%D9%88%D8%B9_%D8%A7%D9%84%D8%A3%D9%86%D8%A7%D8%B4%D9%8A%D8%AF_%D9%81%D9%8A_2023_-_Qamaron___Malak_Fathi%2848k%29.mp3"
  },
  {
    id: 27,
    title: "Bika Moulhimi",
    artist: "Maher Zain & Mustafa Ceceli",
    album: "Bika Moulhimi",
    duration: "4:37",
    coverUrl: "/images/bike-mulhimi_maher.png",
    audioUrl: "https://dn710400.ca.archive.org/0/items/sami-yusuf-ya-hayyu-ya-qayyum-feat.-abida-parveen-official-audio-worldmusic-48k/%D9%85%D8%A7%D9%87%D8%B1_%D8%B2%D9%8A%D9%86_%D9%88%D9%85%D8%B5%D8%B7%D9%81%D9%89_%D8%AC%D9%8A%D8%AC%D9%8A%D9%84%D9%8A_-_%D8%A8%D9%90%D9%83%D9%8E_%D9%85%D9%8F%D9%84%D9%87%D9%90%D9%85%D9%8A___Maher_Zain___Mustafa_Ceceli_-_Bika_Moulhimi%2848k%29.mp3"
  },
  {
    id: 28,
    title: "Tala' Al Badru Alayna",
    artist: "Malak Fathi & Fatoom",
    album: "Tala' Al Badru Alayna",
    duration: "3:17",
    coverUrl: "/images/teleal-bedru-aleyna_melak.png",
    audioUrl: "https://archive.org/download/sami-yusuf-ya-hayyu-ya-qayyum-feat.-abida-parveen-official-audio-worldmusic-48k/%D9%85%D9%84%D8%A7%D9%83_%D9%81%D8%AA%D8%AD%D9%8A_%D9%88%D9%81%D8%B7%D9%88%D9%85___%D8%B7%D9%84%D8%B9_%D8%A7%D9%84%D8%A8%D8%AF%D8%B1_%D8%B9%D9%84%D9%8A%D9%86%D8%A7____Malak_Fathi_and_Fatoom%2848k%29.mp3"
  },
  {
    id: 29,
    title: "Huwa Ahmadun",
    artist: "Malak Fathi",
    album: "Huwa Ahmadun",
    duration: "3:46",
    coverUrl: "/images/huwa-ahmedun_melak.png",
    audioUrl: "https://archive.org/download/sami-yusuf-ya-hayyu-ya-qayyum-feat.-abida-parveen-official-audio-worldmusic-48k/%D9%87%D9%88_%D8%A3%D8%AD%D9%85%D8%AF%D9%8C____%D9%85%D9%84%D8%A7%D9%83_%D9%81%D8%AA%D8%AD%D9%8A_-_Huwa_Ahmadun___Malak_Fathi%2848k%29.mp3"
  },
  {
    id: 30,
    title: "Wahashna Ya Rasul Allah",
    artist: "Malak Fathi",
    album: "Wahashna",
    duration: "5:01",
    coverUrl: "/images/wahishna_melak.png",
    audioUrl: "https://archive.org/download/sami-yusuf-ya-hayyu-ya-qayyum-feat.-abida-parveen-official-audio-worldmusic-48k/%D9%88%D8%AD%D8%B4%D9%86%D8%A7_%D9%8A%D8%A7_%D8%B1%D8%B3%D9%88%D9%84_%D8%A7%D9%84%D9%84%D9%87___%D8%A3%D8%AF%D8%A7%D8%A1_%D8%A7%D9%84%D8%B7%D9%81%D9%84%D8%A9_%D8%A7%D9%84%D9%85%D8%A8%D8%AF%D8%B9%D8%A9_-_%D9%85%D9%84%D8%A7%D9%83_%D9%81%D8%AA%D8%AD%D9%8A%2848k%29.mp3"
  },
];

export default mockSongs;
