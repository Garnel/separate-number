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
            'separate-number:toggle': () => this.toggle()
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

            const worker = new NumberSeparator();
            var ranges = editor.getSelectedBufferRanges();
            ranges.forEach(function(range) {
                var word = editor.getTextInBufferRange(range);
                var numbers = word.match(/\d[_\d]+/g);
                if (!numbers) {
                    return;
                }
                var newNumber;
                numbers.forEach(function(number) {
                    word = word.replace(number, worker.toggleNumber(number));
                });
                editor.setTextInBufferRange(range, word);
            });
        }
    }
};

class NumberSeparator {
    constructor(separator) {
        this.separator = separator || '_';
    }

    toggleNumber(number) {
        var pos = number.indexOf(this.separator);
        if (pos == -1) { // no separator
            return this.separateNumber(number, this.separator);
        } else if (pos > 0 && pos <= 3) {
            var newPos = number.indexOf(this.separator, pos + 1);
            while (newPos == pos + 3 + this.separator.length) {
                pos = newPos;
                newPos = number.indexOf(this.separator, pos + 1);
            }
            if (newPos == -1 && pos == number.length - 3 - this.separator.length) {
                return this.unseparateNumber(number, this.separator);
            }
        }

        return number;
    }

    separateNumber(number) {
        if (typeof number === 'string') {
            var length = number.length;
            if (length <= 3) {
                return number;
            }
            var start = length % 3;
            var result = start > 0 ? number.substring(0, start) : '';
            for (var i = start; i < length; i += 3) {
                if (i > 0) {
                    result += this.separator;
                }
                result += number.substring(i, i + 3);
            }
            return result;
        }
        return '';
    }

    unseparateNumber = function(number_with_separator) {
        return number_with_separator.split(this.separator).join('');
    }
}
