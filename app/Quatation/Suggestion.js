// components/SuggestionsDropdown.js
import React from 'react';

const Suggestion = ({ suggestions, position, onSuggestionClick }) => {
  return (
    suggestions.length > 0 && (
      <ul
        className="border absolute border-gray-300 w-52 h-32 overflow-y-auto bg-white rounded shadow-lg"
        style={{
          top: position.top,
          left: position.left,
          zIndex: 1000,
        }}
      >
        {suggestions.map((suggestion, suggestionIndex) => (
          <li
            key={suggestionIndex}
            onClick={() => onSuggestionClick(suggestion)}
            className="p-2 cursor-pointer hover:bg-gray-200"
          >
            {suggestion}
          </li>
        ))}
      </ul>
    )
  );
};

export default Suggestion;
