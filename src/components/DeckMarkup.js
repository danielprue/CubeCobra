import React from 'react';
import PropTypes from 'prop-types';

import { CardBody, CardHeader, CardTitle } from 'reactstrap';
import { cardFromId } from '../../serverjs/cards.js';

import DeckMarkupSection from './DeckMarkupSection.js';

// card sort helper function
function sortCards(cards) {
  cards.sort(function (a, b) {
    a.cmc < b.cmc ? 1 : -1;
  });
  return cards;
}

//parse card list from deck
function cardList(deck, sideboard) {
  const cards = {
    creatures: [],
    spells: [],
    planeswalkers: [],
    artifacts: [],
    enchantments: [],
    other: [],
    sideboard: [],
  };

  //loop through each pile in deck (should be 16)
  for (let i = 0; i < deck.length; i++) {
    //loop through each card in the pile
    for (let j = 0; j < deck[i].length; j++) {
      if (/creature/.test(deck[i][j].type_line.lower())) {
        cards.creatures.push({ cardID: deck[i][j].cardID, cmc: deck[i][j].cmc, colors: deck[i][j].colors });
      } else if (/planeswalker/.test(deck[i][j].type_line.lower())) {
        cards.planeswalkers.push({ cardID: deck[i][j].cardID, cmc: deck[i][j].cmc, colors: deck[i][j].colors });
      } else if (/artifact/.test(deck[i][j].type_line.lower())) {
        cards.artifacts.push({ cardID: deck[i][j].cardID, cmc: deck[i][j].cmc, colors: deck[i][j].colors });
      } else if (/enchantment/.test(deck[i][j].type_line)) {
        cards.enchantments.push({ cardID: deck[i][j].cardID, cmc: deck[i][j].cmc, colors: deck[i][j].colors });
      } else if (/instant|sorcery/.test(deck[i][j].type_line.lower())) {
        cards.spells.push({ cardID: deck[i][j].cardID, cmc: deck[i][j].cmc, colors: deck[i][j].colors });
      } else {
        cards.other.push({ cardID: deck[i][j].cardID, cmc: deck[i][j].cmc, colors: deck[i][j].colors });
      }
    }
  }

  // add sideboard to cards
  for (let i = 0; i < sideboard.length; i++) {
    for (let j = 0; j < sideboard[i].length; j++) {
      cards.sideboard.push({ cardID: deck[i][j].cardID, cmc: deck[i][j].cmc, colors: deck[i][j].colors });
    }
  }

  // sort each group of cards
  for (const [key, value] of Object.entries(cards)) {
    cards[key] = sortCards(value);
  }

  return cards;
}

// helper function to get card name and mana cost from database
function additionalCardInfo(cards) {
  for (const [key, value] of Object.entries(cards)) {
    for (const i = 0; i < value.length; i++) {
      const cardInfo = cardFromId(value[i].cardID, ['name', 'mana_cost']);
      console.log(cardInfo);
      cards[key] = { ...value, name: cardInfo.name, mana_cost: cardInfo.mana_cost };
    }
  }
  return cards;
}

const DeckMarkup = ({ deck }) => {
  //make a function here that splits the cards into relevant arrays
  let deckContents = cardList(deck.seats[0].deck, deck.seats[0].sideboard);
  //make a function here that queries name and mana costs
  deckContents = additionalCardInfo(deckContents);
  return (
    <>
      <CardHeader>
        <CardTitle className="mb-0 d-flex flex-row align-items-end">
          <h4 className="mb-0 mr-auto">{deck.seats[0].name}</h4>
        </CardTitle>
      </CardHeader>
      <CardBody>
        {deckContents.creatures ? <DeckMarkupSection cards={deckContents.creatures} sectionName="Creatures" /> : ''}
        {deckContents.spells ? <DeckMarkupSection cards={deckContents.spells} sectionName="Spells" /> : ''}
        {deckContents.planeswalkers ? (
          <DeckMarkupSection cards={deckContents.planeswalkers} sectionName="Planeswalkers" />
        ) : (
          ''
        )}
        {deckContents.enchantments ? (
          <DeckMarkupSection cards={deckContents.enchantments} sectionName="Enchantments" />
        ) : (
          ''
        )}
        {deckContents.artifacts ? <DeckMarkupSection cards={deckContents.artifacts} sectionName="Artifacts" /> : ''}
        {deckContents.other ? <DeckMarkupSection cards={deckContents.other} sectionName="Other" /> : ''}
        {deckContents.sideboard ? <DeckMarkupSection cards={deckContents.sideboard} sectionName="Sideboard" /> : ''}
      </CardBody>
    </>
  );
};

DeckMarkup.propTypes = {
  deck: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    cube: PropTypes.string.isRequired,
    seats: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default DeckMarkup;
