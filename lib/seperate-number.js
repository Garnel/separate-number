'use babel';

import {
    CompositeDisposable
} from 'atom';

export default {
    subscriptions: null,

    activate() {
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'seperate-number:toggle': () => this.toggle()
        }));
    },

    deactivate() {
        this.subscriptions.dispose();
    },

    toggle() {
        if (editor = atom.workspace.getActiveTextEditor()) {
            if (editor.getSelectedText() === '') {
                editor.selectWordsContainingCursors();
            }

            const worker = new NumberSeperator();
            var word = editor.getSelectedText();
            var numbers = word.match(/\d[_\d]+/g);
            var newNumber;
            numbers.forEach(function(number) {
                word = word.replace(number, worker.toggleNumber(number));
            });
            editor.insertText(word);
        }
    }
};

class NumberSeperator {
    constructor(seperator) {
        this.seperator = seperator || '_';
    }

    toggleNumber(number) {
        var pos = number.indexOf(this.seperator);
        if (pos == -1) { // no seperator
            return this.seperateNumber(number, this.seperator);
        } else if (pos > 0 && pos <= 3) {
            var newPos = number.indexOf(this.seperator, pos + 1);
            while (newPos == pos + 3 + this.seperator.length) {
                pos = newPos;
                newPos = number.indexOf(this.seperator, pos + 1);
            }
            if (newPos == -1 && pos == number.length - 3 - this.seperator.length) {
                return this.unSeperateNumber(number, this.seperator);
            }
        }

        return number;
    }

    seperateNumber(number) {
        if (typeof number === 'string') {
            var length = number.length;
            if (length <= 3) {
                return number;
            }
            var start = length % 3;
            var result = start > 0 ? number.substring(0, start) : '';
            for (var i = start; i < length; i += 3) {
                if (i > 0) {
                    result += this.seperator;
                }
                result += number.substring(i, i + 3);
            }
            return result;
        }
        return '';
    }

    unSeperateNumber = function(number_with_seperator) {
        return number_with_seperator.split(this.seperator).join('');
    }
}
