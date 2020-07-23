const rp = require('request-promise')

const { TimexProperty } = require('@microsoft/recognizers-text-data-types-timex-expression');
const { InputHints, MessageFactory } = require('botbuilder');
const { ConfirmPrompt, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');
const { CancelAndHelpDialog } = require('./cancelAndHelpDialog');
const { DateResolverDialog } = require('./dateResolverDialog');

const CONFIRM_PROMPT = 'confirmPrompt';
const DATE_RESOLVER_DIALOG = 'dateResolverDialog';
const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';

class ThankyouDialog extends CancelAndHelpDialog {
    constructor(id) {
        super(id || 'thankyouDialog');

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
            .addDialog(new DateResolverDialog(DATE_RESOLVER_DIALOG))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.confirmStep.bind(this),
                this.finalStep.bind(this)
            ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async confirmStep(stepContext) {
        const messageText = `Do you have any more questions?`;
        const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);

        // Offer a YES/NO prompt.
        return await stepContext.prompt(CONFIRM_PROMPT, { prompt: msg });
    }

    /**
     * Complete the interaction and end the dialog.
     */
    async finalStep(stepContext) {
        if (stepContext.result === true) {
            console.log('final step yes=====',stepContext.options)
            const yesResult = {
                "Yes": "How can i help you?"
            }
            // const yesResult = stepContext.options;
            return await stepContext.endDialog(yesResult);
        } else {
            console.log('final step no=====',stepContext.options)            
            const noResult = {
                "No": "Feel free to reach out if you have any more questions going forward! Have a nice day!"
            }
            return await stepContext.endDialog(noResult);
        }
    }
}

module.exports.ThankyouDialog = ThankyouDialog;
