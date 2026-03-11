const content = `[MEKAN:karga-kadikoy]
## Mekan 2
Mekan 2 çok güzel.

[MEKAN:dorock-xl]
## Mekan 3`;
const contentBlocks = content.split(/(\[MEKAN:[^\]]+\])/g).filter(Boolean);
console.log(contentBlocks);
