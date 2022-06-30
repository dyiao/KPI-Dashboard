export const dataKeyArray = []

const colorArray = [
  '#ecdb54',
  '#e34132', 
  '#6ca0dc', 
  '#944743',
  '#dbb2d1',
  '#ec9787',
  '#00a68c',
  '#645394',
  '#6c4f3d',
  '#ebe1df',
  '#bc6ca7',
  '#bfd833'
]

for (let i = 0; i < 72; i++) {
  dataKeyArray.push({
    flag: 'flag_'.concat(i.toString()),
    color: colorArray[i % 12]
  })
  //   dataKeyArray[0].flag.push('flag_'.concat(i.toString()))
  //   dataKeyArray[0].color.push(colorArray[i % 12])
}
