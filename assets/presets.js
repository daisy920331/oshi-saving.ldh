// assets/presets.js
// 規則：
// - 個人：不顯示 ( ) 身分；若有 <> 則可在 UI 選擇 roman 或 kanji
// - 團體：若有 (簡稱 XXX) 則可在 UI 選擇 full 或 short
// - 個人池排序：ARTIST → 個人歌手 → 演員 → 模特 → TALENT
// - 名單來源：名單.txt（已補齊）

export const PRESET_GROUPS = [
  // 團體(EXILE TRIBE)
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

  // 團體(其他)
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

// 個人：roman=英文字/羅馬字（或原本就是漢字就放這裡）；kanji=<>內漢字（若有）
export const PRESET_PEOPLE = [
  // =========================
  // 【ARTIST】(先放最上面)
  // =========================

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

  // 三代目J SOUL BROTHERS
  { roman: "ELLY", kanji: "" },
  { roman: "KENJIRO", kanji: "山下健二郎" },
  { roman: "GAN", kanji: "岩田剛典" },
  { roman: "RYUJI", kanji: "今市隆二" },
  { roman: "ØMI", kanji: "" },

  // GENERATIONS
  { roman: "RYOTA", kanji: "片寄涼太" },
  { roman: "RYUTO", kanji: "數原龍友" },
  { roman: "HAYATO", kanji: "小森隼" },
  { roman: "REO", kanji: "佐野玲於" },
  { roman: "YUTA", kanji: "中務裕太" },

  // THE RAMPAGE
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

  // FANTASTICS
  { roman: "S.NATSUKI", kanji: "澤本夏輝" },
  { roman: "LEIYA", kanji: "瀨口黎彌" },
  { roman: "YUSEI", kanji: "八木勇征" },
  { roman: "H.NATSUKI", kanji: "堀夏喜" },
  { roman: "KEITO", kanji: "木村慧人" },
  { roman: "SOTA", kanji: "中島颯太" },
  { roman: "SHOTA", kanji: "中尾翔太" },

  // BALLISTIK BOYZ
  { roman: "RYUTA", kanji: "日高竜太" },
  { roman: "YOSHIYUKI", kanji: "加納嘉將" },
  { roman: "RYUSEI", kanji: "海沼流星" },
  { roman: "MIKU", kanji: "深堀未來" },
  { roman: "RIKIYA", kanji: "奧田力也" },
  { roman: "RIKI", kanji: "松井利樹" },
  { roman: "MASA", kanji: "砂田將宏" },

  // PSYCHIC FEVER
  { roman: "TSURUGI", kanji: "剣" },
  { roman: "RYOGA", kanji: "中西椋雅" },
  { roman: "REN", kanji: "渡邊廉" },
  { roman: "JIMMY", kanji: "" },
  { roman: "KOKORO", kanji: "小波津志" },
  { roman: "RYUSHIN", kanji: "半田龍臣" },
  { roman: "WEESA", kanji: "" },

  // LIL LEAGUE
  { roman: "SENA", kanji: "岩城星那" },
  { roman: "TATSU", kanji: "中村竜大" },
  { roman: "KODAI", kanji: "山田晃大" },
  { roman: "MATORA", kanji: "岡尾真虎" },
  { roman: "HAIMA", kanji: "百田隼麻" },
  { roman: "SORA", kanji: "難波碧空" },

  // KID PHENOMENON
  { roman: "KENSUKE", kanji: "夫松健介" },
  { roman: "TSUBASA", kanji: "遠藤翼空" },
  { roman: "KOHAKUA", kanji: "岡尾琥珀" },
  { roman: "SOMA", kanji: "川口蒼真" },
  { roman: "SHUN", kanji: "佐藤峻乃介" },
  { roman: "KOTA", kanji: "山本光汰" },
  { roman: "RUI", kanji: "鈴木瑠偉" },

  // THE JET BOY BANGERZ
  { roman: "YUHI", kanji: "" },
  { roman: "AERON", kanji: "" },
  { roman: "SHOW", kanji: "" },
  { roman: "TAKUMI", kanji: "" },
  { roman: "HINATA", kanji: "" },
  { roman: "TAKI", kanji: "" },
  { roman: "NOSUKE", kanji: "" },
  { roman: "SHIGETORA", kanji: "" },
  { roman: "AOI", kanji: "" },

  // WOLF HOWL HARMONY
  { roman: "RYOJI", kanji: "" },
  { roman: "SUZUKI", kanji: "" },
  { roman: "GHEE", kanji: "" },
  { roman: "HIROTO", kanji: "" },

  // 其他團體成員（名單內有列）
  // DEEP
  { roman: "DEEP TAKA", kanji: "" },
  { roman: "DEEP YUCHIRO", kanji: "" },
  { roman: "DEEP KEISEI", kanji: "" },

  // DOBERMAN INFINITY
  { roman: "KUBO-C", kanji: "" },
  { roman: "GS", kanji: "" },
  { roman: "P-CHO", kanji: "" },
  { roman: "SWAY", kanji: "" },
  { roman: "KAZUKI", kanji: "" },

  // PKCZ®
  { roman: "DJ DARUMA", kanji: "" },

  // m-flo
  { roman: "TAKU TAKAHASHI", kanji: "" },

  // Girls²
  { roman: "小田柚葉", kanji: "" },
  { roman: "隅谷百花", kanji: "" },
  { roman: "鶴屋美咲", kanji: "" },
  { roman: "小川桜花", kanji: "" },
  { roman: "增田來亞", kanji: "" },
  { roman: "菱田未渚美", kanji: "" },
  { roman: "山口綺羅", kanji: "" },

  // iScream
  { roman: "RUI", kanji: "" },
  { roman: "YUNA", kanji: "" },
  { roman: "HINATA", kanji: "" },

  // Laki
  { roman: "山口莉愛", kanji: "" },
  { roman: "永山椿", kanji: "" },
  { roman: "深澤日彩", kanji: "" },
  { roman: "比嘉優和", kanji: "" },
  { roman: "佐藤栞奈", kanji: "" },
  { roman: "上村梨々香", kanji: "" },
  { roman: "森朱里", kanji: "" },
  { roman: "佐藤妃希", kanji: "" },

  // f5ve
  { roman: "KAEDE", kanji: "" },
  { roman: "SAYAKA", kanji: "" },
  { roman: "MIYUU", kanji: "" },
  { roman: "RURI", kanji: "" },

  // RAG POUND
  { roman: "Twiggz JUN", kanji: "" },
  { roman: "Soulija Twiggz SHOOT", kanji: "" },
  { roman: "Jr Twiggz KTR", kanji: "" },
  { roman: "Baby Twiggz SHUN", kanji: "" },
  { roman: "Kid Twiggz TOMO", kanji: "" },
  { roman: "General Twiggz KC", kanji: "" },
  { roman: "iLL Twiggz KISHIN", kanji: "" },
  { roman: "Prince Twiggz DAISUKE", kanji: "" },

  // SWEET REVENGE
  { roman: "AGNES", kanji: "" },
  { roman: "ASAMI", kanji: "" },
  { roman: "LARISSA", kanji: "" },

  // EXILE B HAPPY（成員名單內有列）
  //（重複者不會影響，你在 UI 加入時會自動跳過已存在）
  { roman: "KEITO", kanji: "木村慧人" },
  { roman: "SOTA", kanji: "中島颯太" },

  // LDH SCREAM
  { roman: "航生", kanji: "" },
  { roman: "來夢", kanji: "" },
  { roman: "RYU-SEI", kanji: "" },
  { roman: "笑大郎", kanji: "" },
  { roman: "京太郎", kanji: "" },
  { roman: "LION", kanji: "" },
  { roman: "Ryunosuke", kanji: "" },
  { roman: "SHUNNOSUKE", kanji: "" },
  { roman: "武藏", kanji: "" },
  { roman: "空", kanji: "" },

  // CIRRA
  { roman: "MYU.S", kanji: "" },
  { roman: "TOA", kanji: "" },
  { roman: "YURARA", kanji: "" },
  { roman: "MOMO", kanji: "" },
  { roman: "NIKORI", kanji: "" },
  { roman: "MYU.Y", kanji: "" },
  { roman: "KOHARU", kanji: "" },
  { roman: "MANON", kanji: "" },

  // 劇團EXILE
  { roman: "小澤雄太", kanji: "" },
  { roman: "町田啓太", kanji: "" },
  { roman: "小野塚勇人", kanji: "" },
  { roman: "佐藤寛太", kanji: "" },
  { roman: "塩野瑛久", kanji: "" },
  { roman: "前田拳太郎", kanji: "" },
  { roman: "櫻井佑樹", kanji: "" },

  // =========================
  // 個人歌手區（ARTIST 之後）
  // =========================
  { roman: "Dream Ami", kanji: "" },
  { roman: "Dream Shizuka", kanji: "" },
  { roman: "VERBAL", kanji: "" },
  { roman: "MIYAVI", kanji: "" },
  { roman: "Crystal Kay", kanji: "" },
  { roman: "JAY'ED", kanji: "" },
  { roman: "Leola", kanji: "" },
  { roman: "青柳翔", kanji: "" },
  { roman: "CRAZY 四角形", kanji: "八木將康" },

  // =========================
  // 演員區
  // =========================
  { roman: "松本利夫", kanji: "" },
  { roman: "RIKACO", kanji: "" },
  { roman: "鈴木伸之", kanji: "" },
  { roman: "石井杏奈", kanji: "" },
  { roman: "山口乃乃華", kanji: "" },
  { roman: "早乙女太一", kanji: "" },
  { roman: "勝矢", kanji: "" },
  { roman: "中山Hinano", kanji: "" },
  { roman: "橫山涼", kanji: "" },

  // =========================
  // 模特
  // =========================
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

  // =========================
  // TALENT（最後）
  // =========================
  { roman: "山口五和", kanji: "" },
  { roman: "LISA", kanji: "" },
];
