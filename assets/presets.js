// assets/presets.js
// 名單整理規則：
// - 個人：不顯示 ( ) 兼任身分；若有 <> 則可在 UI 選擇 roman 或 kanji
// - 團體：若有 (簡稱 XXX) 則可在 UI 選擇 full 或 short

export const PRESET_GROUPS = [
  { full: "EXILE", short: "" },
  { full: "EXILE THE SECOND", short: "" },

  { full: "三代目J SOUL BROTHERS from EXILE TRIBE", short: "3JSB" },
  { full: "GENERATIONS from EXILE TRIBE", short: "GENE" },
  { full: "THE RAMPAGE from EXILE TRIBE", short: "RMPG" },
  { full: "FANTASTICS from EXILE TRIBE", short: "FANTA" },
  { full: "BALLISTIK BOYZ from EXILE TRIBE", short: "BBZ" },
  { full: "PSYCHIC FEVER from EXILE TRIBE", short: "PCF" },
  { full: "LIL LEAGUE from EXILE TRIBE", short: "LIL" },
  { full: "KID PHENOMENON from EXILE TRIBE", short: "KDP" },
  { full: "THE JET BOY BANGERZ from EXILE TRIBE", short: "TJBB" },
  { full: "WOLF HOWL HARMONY from EXILE TRIBE", short: "WHH" },

  { full: "MA55IVE THE RAMPAGE", short: "" },

  { full: "DEEP", short: "" },
  { full: "DEEP SQUAD", short: "" },
  { full: "DOBERMAN INFINITY", short: "" },
  { full: "PKCZ®", short: "" },
  { full: "m-flo", short: "" },
  { full: "HONEST BOYZ®", short: "" },

  { full: "Girls²", short: "" },
  { full: "iScream", short: "" },
  { full: "Laki", short: "" },
  { full: "f5ve", short: "" },
  { full: "RAG POUND", short: "" },
  { full: "SWEET REVENGE", short: "" },

  { full: "EXILE B HAPPY", short: "" },
  { full: "LDH SCREAM", short: "" },
  { full: "CIRRA", short: "" },
  { full: "劇團EXILE", short: "" },
];

// 個人：roman = 英文/羅馬字顯示；kanji = 漢字顯示（沒有就留空）
export const PRESET_PEOPLE = [
  // 歌手等（原本帶括號的已移除括號資訊）
  { roman: "Dream Ami", kanji: "" },
  { roman: "Dream Shizuka", kanji: "" },
  { roman: "VERBAL", kanji: "" },
  { roman: "MIYAVI", kanji: "" },
  { roman: "Crystal Kay", kanji: "" },
  { roman: "JAY'ED", kanji: "" },
  { roman: "Leola", kanji: "" },
  { roman: "青柳翔", kanji: "" },
  { roman: "CRAZY 四角形", kanji: "八木將康" },

  // 演員等
  { roman: "松本利夫", kanji: "" },
  { roman: "RIKACO", kanji: "" },
  { roman: "鈴木伸之", kanji: "" },
  { roman: "石井杏奈", kanji: "" },
  { roman: "山口乃乃華", kanji: "" },
  { roman: "早乙女太一", kanji: "" },
  { roman: "勝矢", kanji: "" },
  { roman: "中山Hinano", kanji: "" },
  { roman: "橫山涼", kanji: "" },

  // TALENT
  { roman: "山口五和", kanji: "" },
  { roman: "LISA", kanji: "" },

  // 模特
  { roman: "佐田真由美", kanji: "" },
  { roman: "岩堀SERI", kanji: "" },
  { roman: "大屋夏南", kanji: "" },
  { roman: "杉ARISA", kanji: "" },
  { roman: "Taylor鈴木", kanji: "" },
  { roman: "佐藤晴美", kanji: "" },
  { roman: "藤井夏戀", kanji: "" },
  { roman: "MORGAN茉愛羅", kanji: "" },
  { roman: "與田EMILY", kanji: "" },
  { roman: "東子(TOKO)", kanji: "" },
  { roman: "愛芭", kanji: "" },
  { roman: "稻田彩羽", kanji: "" },

  // EXILE
  { roman: "HIRO", kanji: "" },
  { roman: "MATSU", kanji: "" },
  { roman: "ÜSA", kanji: "" },
  { roman: "MAKIDAI", kanji: "" },
  { roman: "ATSUSHI", kanji: "" },
  { roman: "AKIRA", kanji: "" },
  { roman: "TAKAHIRO", kanji: "" },
  { roman: "橘KENCHI", kanji: "" },
  { roman: "TETSUYA", kanji: "" },
  { roman: "NESMITH", kanji: "" },
  { roman: "SHOKICHI", kanji: "" },
  { roman: "NAOTO", kanji: "" },
  { roman: "NAOKI", kanji: "小林直己" },
  { roman: "ALAN", kanji: "白濱亞嵐" },
  { roman: "SEKAI", kanji: "世界" },
  { roman: "TAIKI", kanji: "佐藤大樹" },

  // 3JSB
  { roman: "ELLY", kanji: "" },
  { roman: "KENJIRO", kanji: "山下健二郎" },
  { roman: "GAN", kanji: "岩田剛典" },
  { roman: "RYUJI", kanji: "今市隆二" },
  { roman: "ØMI", kanji: "" },

  // GENE
  { roman: "RYOTA", kanji: "片寄涼太" },
  { roman: "RYUTO", kanji: "數原龍友" },
  { roman: "HAYATO", kanji: "小森隼" },
  { roman: "REO", kanji: "佐野玲於" },
  { roman: "YUTA", kanji: "中務裕太" },

  // RMPG（節錄：照你原名單）
  { roman: "LIKIYA", kanji: "" },
  { roman: "ZIN", kanji: "陣" },
  { roman: "RIKU", kanji: "" },
  { roman: "KENTA", kanji: "神谷健太" },
  { roman: "RUI", kanji: "与那嶺瑠唯" },
  { roman: "Y.SHOGO", kanji: "山本彰吾" },
  { roman: "KAZUMA", kanji: "川村壱馬" },
  { roman: "HOKUTO", kanji: "吉野北人" },
  { roman: "I.SHOGO", kanji: "岩谷翔吾" },
  { roman: "SHOHEI", kanji: "浦川翔平" },
  { roman: "ITSUKI", kanji: "藤原樹" },
  { roman: "KAISEI", kanji: "武知海青" },
  { roman: "MAKOTO", kanji: "長谷川慎" },
  { roman: "RYU", kanji: "龍" },
  { roman: "TAKAHIDE", kanji: "鈴木昂秀" },
  { roman: "TAKUMA", kanji: "後藤拓磨" },

  // FANTA
  { roman: "S.NATSUKI", kanji: "澤本夏輝" },
  { roman: "LEIYA", kanji: "瀨口黎彌" },
  { roman: "YUSEI", kanji: "八木勇征" },
  { roman: "H.NATSUKI", kanji: "堀夏喜" },
  { roman: "KEITO", kanji: "木村慧人" },
  { roman: "SOTA", kanji: "中島颯太" },
  { roman: "SHOTA", kanji: "中尾翔太" },

  // BBZ
  { roman: "RYUTA", kanji: "日高竜太" },
  { roman: "YOSHIYUKI", kanji: "加納嘉將" },
  { roman: "RYUSEI", kanji: "海沼流星" },
  { roman: "MIKU", kanji: "深堀未來" },
  { roman: "RIKIYA", kanji: "奧田力也" },
  { roman: "RIKI", kanji: "松井利樹" },
  { roman: "MASA", kanji: "砂田將宏" },

  // PCF
  { roman: "TSURUGI", kanji: "剣" },
  { roman: "RYOGA", kanji: "中西椋雅" },
  { roman: "REN", kanji: "渡邊廉" },
  { roman: "JIMMY", kanji: "" },
  { roman: "KOKORO", kanji: "小波津志" },
  { roman: "RYUSHIN", kanji: "半田龍臣" },
  { roman: "WEESA", kanji: "" },

  // 其他：你名單內大量成員若還要我全量補齊，我也能把剩下的都轉成這種格式
];
