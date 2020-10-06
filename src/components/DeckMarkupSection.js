import React from 'react';
import PropTypes from 'prop-types';

const DeckMarkupSection = ({ cards, sectionName }) => {
  return (
    <table>
      <tbody>
        <th>{sectionName}</th>
        {cards.forEach((card) => {
          return (
            <tr>
              <td>{card.name}</td>
              <td>{card.mana_cost}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

DeckMarkupSection.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.object).isRequired,
  sectionName: PropTypes.string.isRequired,
};

export default DeckMarkupSection;
