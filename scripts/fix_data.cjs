const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/coursesData.js');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix character encoding corruption
const replacements = [
    [/├º├úo/g, 'ção'],
    [/├í/g, 'á'],
    [/├®/g, 'é'],
    [/├¡/g, 'í'],
    [/├│/g, 'ó'],
    [/├║/g, 'ú'],
    [/├á/g, 'à'],
    [/├¬/g, 'ê'],
    [/├┤/g, 'ô'],
    [/├Á/g, 'õ'],
    [/├Ü/g, 'Ú'],
    [/├ë/g, 'É'],
    [/├ú/g, 'ã'],
    [/├º/g, 'ç'],
    [/├ó/g, 'â'],
    [/├ö/g, '—'], // Often used for em-dash
    [/├á/g, 'à'],
    [/├é/g, 'Â'],
    [/├ê/g, 'Ê'],
    [/├î/g, 'Î'],
    [/├ö/g, 'Ô'],
    [/├ø/g, 'ø'],
    [/├Ö/g, 'Ù'],
    // Emoji / Special sequences
    [/ÔÅ│/g, '⏳'],
    [/­ƒôä/g, '📄'],
    [/ÔÜá´©Å/g, '⚠️'],
    [/­ƒÆ░/g, '💰'],
    [/­ƒì¢´©Å/g, '🍲'],
    [/­ƒÅå/g, '🏆'],
    [/­ƒÆ╗/g, '💻'],
    [/­ƒô▒/g, '📱'],
    [/­ƒîÉ/g, '🌐'],
    [/­ƒùú´©Å/g, '🗣️'],
    [/­ƒÜÇ/g, '🚀'],
    [/­ƒöä/g, '🔄'],
    [/­ƒøÆ/g, '🛍️'],
    [/­ƒñØ/g, '🤝'],
    [/­ƒÅó/g, '🏢'],
    [/­ƒæÑ/g, '👥'],
    [/­ƒôê/g, '📈'],
    [/Ô£ö´©Å/g, '✅'],
    [/­ƒöÆ/g, '🔐'],
    [/­ƒøí´©Å/g, '🏛️'],
    [/­ƒÜ½/g, '🚫'],
    [/­ƒîƒ/g, '🌟'],
    [/­ƒô£/g, '📜'],
    [/­ƒô©/g, '📸'],
    [/­ƒôƒ/g, '📋'],
    [/­ƒôô/g, '📖'],
    [/­ƒôÿ/g, '📓']
];

replacements.forEach(([regex, repl]) => {
    content = content.replace(regex, repl);
});

// 2. Fix structural inconsistencies manually or via regex
// Convert "thumbnail:" to "icon:"
content = content.replace(/thumbnail:\s*'([^']+)'/g, "icon: '$1'");
content = content.replace(/thumbnail:\s*"([^"]+)"/g, 'icon: "$1"');

// Fix the 'modules: 5' issue for sistemas_b2
content = content.replace(/modules:\s*5,(\s+)departments:\s*\['Todos'\],(\s+)content:/g, "departments: ['Todos'],$2modules:");

// Fix the same for planejamento_tempo_vendas if it exists
content = content.replace(/modules:\s*12,(\s+)departments:\s*\['Vendas', 'Todos'\],(\s+)content:/g, "departments: ['Vendas', 'Todos'],$2modules:");

fs.writeFileSync(filePath, content, 'utf8');
console.log('coursesData.js fixed successfully!');
