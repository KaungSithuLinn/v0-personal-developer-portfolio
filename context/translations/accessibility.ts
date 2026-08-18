export type SectionTranslations = {
  en: Record<string, string>
  zh: Record<string, string>
  ms: Record<string, string>
  ta: Record<string, string>
  ar: Record<string, string>
}

const accessibility: SectionTranslations = {
  en: {
    "a11y.keyboardNav.arrowKeys": "Use arrow keys to navigate",
    "a11y.keyboardNav.enterSelect": "Press Enter to select",
    "a11y.keyboardNav.escClose": "Press Escape to close",
    "a11y.keyboardNav.tabKey": "Press Tab to move between interactive elements",
  },
  zh: {
    "a11y.keyboardNav.arrowKeys": "使用方向键导航",
    "a11y.keyboardNav.enterSelect": "按回车键选择",
    "a11y.keyboardNav.escClose": "按ESC键关闭",
    "a11y.keyboardNav.tabKey": "按Tab键在交互元素之间移动",
  },
  ms: {
    "a11y.keyboardNav.arrowKeys": "Gunakan kekunci anak panah untuk menavigasi",
    "a11y.keyboardNav.enterSelect": "Tekan Enter untuk memilih",
    "a11y.keyboardNav.escClose": "Tekan Escape untuk menutup",
    "a11y.keyboardNav.tabKey": "Tekan Tab untuk bergerak antara elemen interaktif",
  },
  ta: {
    "a11y.keyboardNav.arrowKeys": "வழிசெலுத்தல் தற்காலிகளை உபயோகించு",
    "a11y.keyboardNav.enterSelect": "தேர்ந்தெடுக்க Enter ஐ அழுத்தவும்",
    "a11y.keyboardNav.escClose": "மூட Escape ஐ அழுத்தவும்",
    "a11y.keyboardNav.tabKey": "இணைப்பு உறுப்புகளுக்கிடையே நகரவும் Tab ஐ அழுத்தவும்",
  },
  ar: {
    "a11y.keyboardNav.arrowKeys": "استخدم مفاتيح الأسهم للتنقل",
    "a11y.keyboardNav.enterSelect": "اضغط على Enter للتحديد",
    "a11y.keyboardNav.escClose": "اضغط على Escape للإغلاق",
    "a11y.keyboardNav.tabKey": "اضغط على Tab للتنقل بين العناصر التفاعلية",
  },
}

export default accessibility
