const fs = require('fs');
const path = require('path');

// The 50 existing external games
const baseGames = [
  {"name": "AstraSpin", "thumbnail": "https://www.dropbox.com/scl/fi/2yq5ynci8qqk51p5pet3f/file_00000000aa1c81faa781466976d65032.png?rlkey=dn6vyl4x89x01qgtpqn9h3086&raw=1", "gameUrl": "play.html", "category": "Casual", "isNew": false},
  {"name": "Wolfoo Maze Adventure", "thumbnail": "https://www.dropbox.com/scl/fi/uml1w7f681jtyfti8dk6g/file_00000000196482088c9a6d04bcc8d731.png?rlkey=3oyh9294wr9o0rgz5hgkob77p&raw=1", "gameUrl": "https://html5.gamemonetize.games/325h6p6tzaeefiur6a50ype2k3id3rrk/", "category": "Kids", "isNew": true},
  {"name": "Stickboy War", "thumbnail": "https://www.dropbox.com/scl/fi/j85uva6nxwmmw5s96juub/file_0000000026b08208afa410ed06532a7f.png?rlkey=5wufbegoie8i7mus2k64i01pm&raw=1", "gameUrl": "https://html5.gamemonetize.games/5g0mc76dxrv2gwcdr9p5yctnru12xdpe/", "category": "Action", "isNew": false},
  {"name": "Cars Tycoon", "thumbnail": "https://www.dropbox.com/scl/fi/d2k3ino1689muqekmzbmj/file_0000000076348208ab73c335172f2bb2.png?rlkey=te51m4xmpc728h1vwsbsskajh&raw=1", "gameUrl": "https://html5.gamemonetize.games/xwaq928fa1zfi6j3xrwzrfkux7mw0eo4/", "category": "Racing", "isNew": false},
  {"name": "Snake Puzzle 3D Game", "thumbnail": "https://www.dropbox.com/scl/fi/z46m3l8kod69275el76e7/file_0000000047088208aa0fed218685bb45.png?rlkey=fj2qv9gpb5nt3xitk010okhag&raw=1", "gameUrl": "https://html5.gamemonetize.games/p7r8fcbrgcsuxbi1blzqg8hdeh8armks/", "category": "Puzzle", "isNew": true},
  {"name": "BlockStacking", "thumbnail": "https://www.dropbox.com/scl/fi/2ogls9ihqccu0eocll3qe/file_00000000873c82089316cd585c7f8671.png?rlkey=etkd5l7bbt0lqcy65uuetgqsl&raw=1", "gameUrl": "https://html5.gamemonetize.games/nuaat2rdliues9xqaphhoqvss2ay1ohn/", "category": "Arcade", "isNew": false},
  {"name": "forest dash", "thumbnail": "https://www.dropbox.com/scl/fi/ed5a9dhlkc8ilak37gyi5/file_0000000040708208a02b6849162b00b6.png?rlkey=uhcx946gzxfbpakeittz1i8s4&raw=1", "gameUrl": "https://html5.gamemonetize.games/rz9ba6bfxnv8xaujk5p4hhcz58k5cy6j/", "category": "Action", "isNew": false},
  {"name": "Reds Winding Way", "thumbnail": "https://www.dropbox.com/scl/fi/umujh830tl8uvll68esbz/file_00000000d5e48208ac7f11a7ca09c9e7.png?rlkey=zb6gjcos6t3pecbcatgm8myr8&raw=1", "gameUrl": "https://html5.gamemonetize.games/fkfno9625kk7y8564cllyqj9vb27bwfi/", "category": "Puzzle", "isNew": false},
  {"name": "Undead Walking 3D", "thumbnail": "https://www.dropbox.com/scl/fi/5eoapxx4dkc4q53dwby4s/file_00000000e340820899531d27d2f60777.png?rlkey=r4c6qrtih57ig15w693n9uxsr&raw=1", "gameUrl": "https://html5.gamemonetize.games/66bos2g1jhk2r1ja7d9m1w8bx5in42wm/", "category": "Action", "isNew": true},
  {"name": "Shadeo", "thumbnail": "https://www.dropbox.com/scl/fi/yjmcxjlz5dyk5084plmrn/file_0000000075f082119b0c41ccfa0bebee.png?rlkey=a8k8g6egvx5pq195uv1xiscsy&raw=1", "gameUrl": "https://html5.gamemonetize.co/8vfho1asm0098j2cmonh52mejbn4wed1/", "category": "Puzzle", "isNew": false},
  {"name": "Maze Escape Hero", "thumbnail": "https://www.dropbox.com/scl/fi/whr516uw59uggmwpzg538/file_00000000a8648208a9ccc11ab296a1bc.png?rlkey=617ebuil48v85y4rwhg2zj19d&raw=1", "gameUrl": "https://html5.gamemonetize.games/q8b3ptca79qtunfxcswnjk7nbmff758j/", "category": "Puzzle", "isNew": false},
  {"name": "Wolfoo Tangram", "thumbnail": "https://www.dropbox.com/scl/fi/cc1br6rsy9a1bmo34whcx/file_00000000540c8208bc670e9160084f8e.png?rlkey=fejs9wvnyoncomns42a5bram1&raw=1", "gameUrl": "https://html5.gamemonetize.games/jybkltxxrz8gpuo138l06twrzi5k969a/", "category": "Kids", "isNew": false},
  {"name": "My Army Base", "thumbnail": "https://www.dropbox.com/scl/fi/pt900riqkge0urfls1bwp/file_000000008f988208a377f6f1eb2baddd.png?rlkey=jknu80waclrew27jquqb5n9jc&raw=1", "gameUrl": "https://html5.gamemonetize.games/572ceho5rkg6hwtxu4cbbzozhnic7qgp/", "category": "Action", "isNew": true},
  {"name": "Ninja Gorilla Jigsaw Puzzle", "thumbnail": "https://www.dropbox.com/scl/fi/736i01vxplxp0szy91705/file_00000000ed00820888f3036c5967d74b.png?rlkey=njmx08nlhd8puhn7407x3k4f2&raw=1", "gameUrl": "https://html5.gamemonetize.games/kk58533eij7rp0qwzzz4k0zmzkhqxqq9/", "category": "Puzzle", "isNew": false},
  {"name": "Border Clash", "thumbnail": "https://www.dropbox.com/scl/fi/nkmyi2t274opdj308k9tu/file_0000000043148209a15c1d5d9f704e86.png?rlkey=89e4a8q9b44c0igmllr8bmz0f&raw=1", "gameUrl": "https://html5.gamemonetize.games/5921u29madpu933ts7ntcfelv43c7w4z/", "category": "Action", "isNew": false},
  {"name": "Nokia 3310 Snack Game", "thumbnail": "https://www.dropbox.com/scl/fi/onaqt4ylaiubzkcj5c4rd/file_00000000c1c08208a3d2bae2286ebfa5.png?rlkey=r3q1zinadk2mfg45upbzy0txp&raw=1", "gameUrl": "https://html5.gamemonetize.games/6b0xlr5mm4dc6fhb5vmk0fd0pycakrx4/", "category": "Arcade", "isNew": false},
  {"name": "The Greedy Crow", "thumbnail": "https://www.dropbox.com/scl/fi/nkmyi2t274opdj308k9tu/file_0000000043148209a15c1d5d9f704e86.png?rlkey=89e4a8q9b44c0igmllr8bmz0f&raw=1", "gameUrl": "https://html5.gamemonetize.games/ho87h1i7wg0b4z4wn8povt2yp0kpuu2s/", "category": "Kids", "isNew": false},
  {"name": "Evolution Arena Battle Royale", "thumbnail": "https://www.dropbox.com/scl/fi/d3d27rpvfogyot9hkbkb0/file_00000000ab108209b4fc26ee5e1910c4.png?rlkey=qhmm6mfm6n4aec8dkraj4zlo6&raw=1", "gameUrl": "https://html5.gamemonetize.games/4adbhwgxkorksg0bcpj17xsnm1p7b5x2/", "category": "Action", "isNew": true},
  {"name": "Block Crush", "thumbnail": "https://www.dropbox.com/scl/fi/ttmur0s4syhz3uatt9fjx/file_00000000fc98821191d6c7e1244ed246.png?rlkey=5oiuwr3khlk06tkxn5cc1ntur&raw=1", "gameUrl": "https://html5.gamemonetize.games/5uxyz8rtoo2zfghu0svgkcgmn7akf4yh/", "category": "Puzzle", "isNew": false},
  {"name": "Dragon Power", "thumbnail": "https://www.dropbox.com/scl/fi/gustfl7w2gz5vbhdiua75/file_00000000938c8211887171621506b1e0.png?rlkey=6tb889qji4r6uclvm70ahjyb0&raw=1", "gameUrl": "https://html5.gamemonetize.games/8wn4vu90rxh6ln82i8s066610snxmoiu/", "category": "Action", "isNew": false},
  {"name": "Merge Royal 2048", "thumbnail": "https://www.dropbox.com/scl/fi/hb2c23895bb8k8vm8v5dk/file_0000000026a482088484eddff6d26818.png?rlkey=yqqh81n5uyd9jlkmfi7k7kfnj&raw=1", "gameUrl": "https://html5.gamemonetize.games/25r9f4p2wvx39zl81xmfz0s6v6txvyoa/", "category": "Puzzle", "isNew": false},
  {"name": "The Last Adventure", "thumbnail": "https://www.dropbox.com/scl/fi/tjl39bm5xifmpbvvzq919/file_00000000b3f08211b431a30bb1e74482.png?rlkey=fdezkepexj4p8y1bu51oqmaov&raw=1", "gameUrl": "https://html5.gamemonetize.games/nrrbcxfrqv6tc74rixopccow45qm8blf/", "category": "Action", "isNew": false},
  {"name": "Drive and Dodge: Car Racing 3D", "thumbnail": "https://www.dropbox.com/scl/fi/1jiwbu89216fw9msuap62/file_0000000027e48211b75c1910748492ab.png?rlkey=n0lw8zmo4skajijwc4r1j9vpb&raw=1", "gameUrl": "https://html5.gamemonetize.games/eevs3wrwe1jwqi87dh1ov6n2opkmdb1y/", "category": "Racing", "isNew": true},
  {"name": "Splatcha!", "thumbnail": "https://www.dropbox.com/scl/fi/vblffwvwwjgbz178a03xd/file_000000006c9081fb9e072e21711ef34d.png?rlkey=x7esaksmkxs4x0zkjnwq5i90m&raw=1", "gameUrl": "https://html5.gamemonetize.games/fxim8vjv68vmfqt3bqfr62mmhn566t52/", "category": "Arcade", "isNew": false},
  {"name": "Obby: Traps And Jumps", "thumbnail": "https://www.dropbox.com/scl/fi/r529uaivc16j6tars75w6/file_000000009e2c8230be77e3cbcb752b4f.png?rlkey=rdcpv8x7quivdx7krdgruewze&raw=1", "gameUrl": "https://html5.gamemonetize.games/jzxxdr3hvkp7s3zcwhmicrot1q7rmpvi/", "category": "Action", "isNew": false},
  {"name": "Tiger Coloring Book", "thumbnail": "https://www.dropbox.com/scl/fi/63s2yuo5kbwhh5uhw63ps/file_00000000266081fdb8c36e1dae72a402.png?rlkey=cqwo7f5v0ny0l9wof4zrhry0t&raw=1", "gameUrl": "https://html5.gamemonetize.games/9mezx3shlsfag58h6f3qseyxxtmkdfrt/", "category": "Kids", "isNew": false},
  {"name": "Trio Twist Puzzle", "thumbnail": "https://www.dropbox.com/scl/fi/hb2c23895bb8k8vm8v5dk/file_0000000026a482088484eddff6d26818.png?rlkey=yqqh81n5uyd9jlkmfi7k7kfnj&raw=1", "gameUrl": "https://html5.gamemonetize.games/19bydoh88tudafz8fvhm97llktgt6vih/", "category": "Puzzle", "isNew": false},
  {"name": "Cute Animal Puzzle Game", "thumbnail": "https://www.dropbox.com/scl/fi/3m43lplugkbj13vuhzsd7/file_00000000af4081fbbd5c46b2a1cc42b5.png?rlkey=nirelinhttl2q64l33yo9k0ps&raw=1", "gameUrl": "https://html5.gamemonetize.games/svc0a1dfc37v3yl57d78fv9zja6vbrbh/", "category": "Kids", "isNew": false},
  {"name": "Mahjong Bird Tiles", "thumbnail": "https://www.dropbox.com/scl/fi/nch2vfo3kw01f3hoq0684/Mahjong-Bird-Tiles-512x512.jpg?rlkey=v2kkrv5041knn4g16q7j51lg0&raw=1", "gameUrl": "https://html5.gamemonetize.games/i3eg65u2gdp73rrxdlycvue65qxik1ha/", "category": "Puzzle", "isNew": false},
  {"name": "Emoji Line Puzzle", "thumbnail": "https://www.dropbox.com/scl/fi/2dyhnhn2v9yaz2cle016a/file_00000000c1308207beec1a07f7d667da.png?rlkey=1p43cc4nlklike3c71zclzg82&raw=1", "gameUrl": "https://html5.gamemonetize.games/ussw9l3ypn90k3dq23xugv25xfde2h0z/", "category": "Puzzle", "isNew": false},
  {"name": "Sunny Spell", "thumbnail": "https://www.dropbox.com/scl/fi/zgu969w4moef87h9qbr3p/file_0000000076388209b735214ec05a0031.png?rlkey=fle5apubp1f7dctzxk4g05xyq&raw=1", "gameUrl": "https://html5.gamemonetize.games/13vb7ekr5qbc07cea99y3gfu1mdl0beb/", "category": "Kids", "isNew": true},
  {"name": "Taxi Driver Ultimate", "thumbnail": "https://www.dropbox.com/scl/fi/fer52zb7osx39etfmd2hb/file_00000000a36081f8a4bf0d415ac351e6.png?rlkey=jd72941t3blwetk7k14oh7z8z&raw=1", "gameUrl": "https://html5.gamemonetize.games/pmto5x09kwupuhqxuv893k4209b43sra/", "category": "Racing", "isNew": false},
  {"name": "Landing Hero", "thumbnail": "https://www.dropbox.com/scl/fi/wey3ktewnmos9aa2mna3j/file_0000000005e8820ba611142731fbc4b5.png?rlkey=50ncd18vuq1olw67rcsj5h33u&raw=1", "gameUrl": "https://html5.gamemonetize.games/unl2t99qvksbjdrfmns3o8tl9zulikxn/", "category": "Arcade", "isNew": false},
  {"name": "Paws Up", "thumbnail": "https://www.dropbox.com/scl/fi/apxdho68w28b00p3tyref/file_00000000081c81fabf6b6764464b3dcf.png?rlkey=8bcxfmvvsgghaf6j0o90yd6q0&raw=1", "gameUrl": "https://html5.gamemonetize.games/byup37a0na7wv43exxwl2onzvl3eu10e/", "category": "Arcade", "isNew": false},
  {"name": "Zombi Defense", "thumbnail": "https://www.dropbox.com/scl/fi/l8bwj6jg8w28f7faq57v6/file_00000000def0823093819caa6699605d.png?rlkey=ixgkbxpq42dbfkv5d6vcmw39d&raw=1", "gameUrl": "https://html5.gamemonetize.games/prhu172i8mne9pzmzscopypk1eyrqvve/", "category": "Action", "isNew": false},
  {"name": "Hero Monster Battle Game", "thumbnail": "https://www.dropbox.com/scl/fi/504p6bgnu4f9123apgaxb/file_00000000de9c81fa910ee35317febd70.png?rlkey=9xvx333ek7nooade9lyt9xf5d&raw=1", "gameUrl": "https://html5.gamemonetize.games/6doelx16q7orssbq3ux8a8u1bra89w0c/", "category": "Action", "isNew": false},
  {"name": "Sniper Corps", "thumbnail": "https://www.dropbox.com/scl/fi/tp1tp2l3peqrnp4x5rbyo/file_000000001808820bb44f63032ae5723e.png?rlkey=w8u7r6zbo99h73x3pb1gn9yy2&raw=1", "gameUrl": "https://html5.gamemonetize.games/awoa5hf68467okwkcqntdqo7kzuvx2bq/", "category": "Action", "isNew": false},
  {"name": "Dresser Avatar", "thumbnail": "https://www.dropbox.com/scl/fi/z30fvry6uj07etqbagkre/file_0000000075848211adf9753c2f3ad03a.png?rlkey=ff8bw4bkqvf2248zqbkz2nfnz&raw=1", "gameUrl": "https://html5.gamemonetize.games/6our5ufbzognhn9cnw3nopxrzhxzg6k9/", "category": "Kids", "isNew": true},
  {"name": "Bikkings: brothers to valhalla", "thumbnail": "https://www.dropbox.com/scl/fi/uzxwvbcamwzgvwdvl72pt/file_000000009fa081faaee3ef9e69098af8.png?rlkey=ic5k7d96glp5hdwelmjoo5p81&raw=1", "gameUrl": "https://html5.gamemonetize.games/655n5q7c9b3lkrt0sj373e9ccvcek2yx/", "category": "Action", "isNew": false},
  {"name": "MemoPlay", "thumbnail": "https://www.dropbox.com/scl/fi/mwbbphxyup25qsm505tlc/file_0000000067c4820b9ec1a584736f626f.png?rlkey=tqp799ve8mnskroz6l8wtqkjt&raw=1", "gameUrl": "https://html5.gamemonetize.games/kubm5wihrxgifm5h0my3cl9eucoiq2v3/", "category": "Puzzle", "isNew": false},
  {"name": "Chinchilla Trails", "thumbnail": "https://www.dropbox.com/scl/fi/bsp8iekt9aeytz72esfkv/file_000000004104820785b08f0ec773bd65.png?rlkey=ms4w9xjne5sjz43nnvaeokpfj&raw=1", "gameUrl": "https://html5.gamemonetize.games/psex0pu8c87epfkv1oyz1udy08443lm7/", "category": "Puzzle", "isNew": false},
  {"name": "Bad Cat Prankster Moms Return", "thumbnail": "https://www.dropbox.com/scl/fi/szgvbspndewmao8v5tz0j/file_00000000cdc081faae5b4099e2de2bfe.png?rlkey=j3esyy98g7q8jmh9j74i0730d&raw=1", "gameUrl": "https://html5.gamemonetize.games/1d7if1wi5xc3huco6ti0nr2mbwexqimr/", "category": "Kids", "isNew": false},
  {"name": "Freight", "thumbnail": "https://www.dropbox.com/scl/fi/5sj46gh14uzojthjj63b4/file_00000000226c820b8c38783c311e3534.png?rlkey=yhdk2tz0w5w4euu1a1hp3ynip&raw=1", "gameUrl": "https://html5.gamemonetize.games/bzurcjmddtj7xub90bf9puihzlj68i6v/", "category": "Arcade", "isNew": false},
  {"name": "SkyHop!", "thumbnail": "https://www.dropbox.com/scl/fi/u726d08gr019gwn7ytma0/file_00000000082481fa901d08cf6fbff595.png?rlkey=ibcdhxzen1ps65zzhaf6p313v&raw=1", "gameUrl": "https://html5.gamemonetize.games/lf6epuc15f2gnwxjvkk1l78cpdo68krb/", "category": "Arcade", "isNew": false},
  {"name": "Bear Go Home", "thumbnail": "https://www.dropbox.com/scl/fi/u69oiezh6d26ak75shubd/file_00000000935c820b81609e0692af5e71.png?rlkey=opaea7zvq74lm4l6hjcwry9jn&raw=1", "gameUrl": "https://html5.gamemonetize.games/7jvzazw0rfch8xt5yb9t4dqwvrfcnau0/", "category": "Puzzle", "isNew": false},
  {"name": "Mountain Bike Xtreme", "thumbnail": "https://www.dropbox.com/scl/fi/wihnd4cqclwrojh5hus8v/file_00000000ea608211a99a31644840e1b1.png?rlkey=g2ashkgv7lyozr9miz3lxsaj9&raw=1", "gameUrl": "https://html5.gamemonetize.games/zyhebe7h94bxl7ig0gw7mcesn9tst3bm/", "category": "Racing", "isNew": false},
  {"name": "Zombie Siege", "thumbnail": "https://www.dropbox.com/scl/fi/ovj1flghdy0kgnu8beye0/file_00000000d97481faa57edb4a2d477ba5.png?rlkey=sekvld8allzzykmi2x73ibviw&raw=1", "gameUrl": "https://html5.gamemonetize.games/tark0i208v8u3vh634f5k7p2xffftwgv/", "category": "Action", "isNew": false},
  {"name": "Car Word Hunt", "thumbnail": "https://www.dropbox.com/scl/fi/xrkb93qwuafwt8o3p1wh1/file_00000000a618820b992e79b6df087ad2.png?rlkey=487sv0ohs2zvh7u28vic3piox&raw=1", "gameUrl": "https://html5.gamemonetize.games/u2m6de7ylbhetfhprgckox2krn5uwkto/", "category": "Puzzle", "isNew": false},
  {"name": "Sort Color Water Puzzle", "thumbnail": "https://www.dropbox.com/scl/fi/faas6hyyixybiyj2x44ue/file_0000000070e8820683570f0d98c63931.png?rlkey=h2svk45vq5ag0q10wzhippucb&raw=1", "gameUrl": "https://html5.gamemonetize.games/tji0kvqoftggeanohsx75fatit8vb9b8/", "category": "Puzzle", "isNew": false},
  {"name": "Kim Jong Un Backroom", "thumbnail": "https://www.dropbox.com/scl/fi/9aqkpvjl15vvdoiwc5rrg/file_000000001b288211b286ea374edc61b3.png?rlkey=ndl46xbel3b15pryk6fu6ip72&raw=1", "gameUrl": "https://html5.gamemonetize.games/ovdr36phl8kni2mh8qop0ml5992qk0iv/", "category": "Action", "isNew": false}
];

// 1. Scan /games/ directory for in-house games with bulletproof directory traversal
function discoverInHouseGames() {
  const gamesDir = path.join(__dirname, 'games');
  if (!fs.existsSync(gamesDir)) return [];

  const entries = fs.readdirSync(gamesDir, { withFileTypes: true });
  const inHouseGames = [];

  entries.forEach(entry => {
    // Strictly verify it's a directory to ignore files like .DS_Store
    if (!entry.isDirectory()) return;

    const folderName = entry.name;
    const folderPath = path.join(gamesDir, folderName);
    const manifestPath = path.join(folderPath, 'manifest.json');

    if (fs.existsSync(manifestPath)) {
      try {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        
        // Robust thumbnail detection
        let thumbPath = `games/${folderName}/thumbnail.png`; // Default
        const pngPath = path.join(folderPath, 'thumbnail.png');
        const jpgPath = path.join(folderPath, 'thumbnail.jpg');

        if (manifest.thumbnail) {
            thumbPath = manifest.thumbnail;
        } else if (fs.existsSync(pngPath)) {
            thumbPath = `games/${folderName}/thumbnail.png`;
        } else if (fs.existsSync(jpgPath)) {
            thumbPath = `games/${folderName}/thumbnail.jpg`;
        }

        inHouseGames.push({
          name: manifest.name || folderName,
          thumbnail: thumbPath,
          gameUrl: `games/${folderName}/index.html`,
          category: manifest.category || 'Casual',
          isNew: manifest.isNew !== undefined ? Boolean(manifest.isNew) : true
        });
      } catch (e) {
        console.error(`Error parsing manifest.json in games/${folderName}/:`, e.message);
      }
    }
  });

  return inHouseGames;
}

// 2. Combine games (In-house prepended first, then base games)
const inHouseGames = discoverInHouseGames();
const allGames = [...inHouseGames, ...baseGames];
const jsonPayload = JSON.stringify(allGames, null, 2);

// 3. Inject into HTML files
const targetFiles = ['index.html', 'games.html', 'new-games.html', 'categories.html'];
const regex = /<script type="application\/json" id="game-database">[\s\S]*?<\/script>/g;
const replacement = `<script type="application/json" id="game-database">${jsonPayload}</script>`;

targetFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (regex.test(content)) {
      content = content.replace(regex, replacement);
      fs.writeFileSync(filePath, content);
      console.log(`Successfully injected game database into ${file}`);
    } else {
      console.warn(`Warning: Could not find game-database script tag in ${file}`);
    }
  } else {
    console.warn(`Warning: File ${file} not found.`);
  }
});

console.log('Build script completed successfully.');
