const express = require('express')
const request = require('request');
const cheerio = require('cheerio');
const async = require('async');

let typeObjList = [
  {
    name: 'normal',
    id: 1
  },{
    name: 'fire',
    id: 2
  },{
    name: 'water',
    id: 3
  },{
    name: 'electric',
    id: 4
  },{
    name: 'grass',
    id: 5
  },{
    name: 'ice',
    id: 6
  },{
    name: 'fighting',
    id: 7
  },{
    name: 'poison',
    id: 8
  },{
    name: 'ground',
    id: 9
  },{
    name: 'flying',
    id: 10
  },{
    name: 'psychic',
    id: 11
  },{
    name: 'bug',
    id: 12
  },{
    name: 'rock',
    id: 13
  },{
    name: 'ghost',
    id: 14
  },{
    name: 'dragon',
    id: 15
  },{
    name: 'dark',
    id: 16
  },{
    name: 'steel',
    id: 17
  },{
    name: 'fairy',
    id: 18
  }
];

typeObj = typeObjList[1];
console.log(typeObj.name);

request(`https://www.serebii.net/pokedex-xy/${typeObj.name}.shtml`, (err, cheerioResp, html) => {
  if (!err && cheerioResp.statusCode == 200) {
    const $ = cheerio.load(html)

    let pokesThatAre = [];


    let howManyAre = $('.dextable').eq(0).children('tbody').children('tr').length - 2;
    console.log(howManyAre);

    for (var i = 2; i < howManyAre + 2; i++) {
      let pokeThatIs = $('.dextable').eq(0).children('tbody').children('tr').eq(i).children('td').eq(0).text();
      let pokeThatIsRegex = pokeThatIs.match(/[0-9]{3}/g)[0];
      console.log(Number(pokeThatIsRegex));
      pokesThatAre.push(Number(pokeThatIsRegex));
    }


    let pokesByType = {
      id: typeObj.id,
      name: typeObj.name,
      whatPokesAre: pokesThatAre
    }
    console.log(pokesByType);
  }
})
