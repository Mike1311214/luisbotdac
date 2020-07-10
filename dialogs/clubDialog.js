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

class ClubDialog extends CancelAndHelpDialog {
    constructor(id) {
        super(id || 'clubDialog');

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
            .addDialog(new DateResolverDialog(DATE_RESOLVER_DIALOG))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.clubName.bind(this),
                this.confirmStep.bind(this),
                this.finalStep.bind(this)
            ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async clubName(stepContext){
            const ClubDetails = stepContext.options;
            console.log("in new dialog",ClubDetails.club)
            if(!ClubDetails.club){
                const messageText = 'Please tell me the club name..';
                const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
                return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });
            }
            return await stepContext.next(ClubDetails.club);
    }

    async confirmStep(stepContext) {
        const ClubDetails = stepContext.options;

        // Capture the results of the previous step
        ClubDetails.club = stepContext.result;
        const messageText = `Please confirm, I am sharing you the details of ${ ClubDetails.club }`;
        const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);

        // Offer a YES/NO prompt.
        return await stepContext.prompt(CONFIRM_PROMPT, { prompt: msg });
    }

    /**
     * Complete the interaction and end the dialog.
     */
    async finalStep(stepContext) {
        if (stepContext.result === true) {
            const ClubDetails = stepContext.options;
            console.log("final step of club dialog ",ClubDetails)
            return await stepContext.endDialog(ClubDetails);
        }
        return await stepContext.endDialog();
    }
}

module.exports.ClubDialog = ClubDialog;
