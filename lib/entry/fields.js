"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fields = void 0;
exports.fields = {
    recordTypeCode: {
        name: 'Record Type Code',
        width: 1,
        position: 1,
        required: true,
        type: 'numeric',
        value: '6'
    },
    transactionCode: {
        name: 'Transaction Code',
        width: 2,
        position: 2,
        required: true,
        type: 'numeric'
    },
    receivingDFI: {
        name: 'Receiving DFI Identification',
        width: 8,
        position: 3,
        required: true,
        type: 'numeric',
        value: ''
    },
    checkDigit: {
        name: 'Check Digit',
        width: 1,
        position: 4,
        required: true,
        type: 'numeric',
        value: ''
    },
    DFIAccount: {
        name: 'DFI Account Number',
        width: 17,
        position: 5,
        required: true,
        type: 'alphanumeric',
        value: ''
    },
    amount: {
        name: 'Amount',
        width: 10,
        position: 6,
        required: true,
        type: 'numeric',
        value: '',
        number: true
    },
    idNumber: {
        name: 'Individual Identification Number',
        width: 15,
        position: 7,
        required: false,
        type: 'alphanumeric',
        value: ''
    },
    individualName: {
        name: 'Individual Name',
        width: 22,
        position: 8,
        required: true,
        type: 'alphanumeric',
        value: ''
    },
    discretionaryData: {
        name: 'Discretionary Data',
        width: 2,
        position: 9,
        required: false,
        type: 'alphanumeric',
        value: '',
    },
    addendaId: {
        name: 'Addenda Record Indicator',
        width: 1,
        position: 10,
        required: true,
        type: 'numeric',
        value: '0'
    },
    traceNumber: {
        name: 'Trace Number',
        width: 15,
        position: 11,
        required: false,
        type: 'numeric',
        blank: true,
        value: ''
    }
};
module.exports = { fields: exports.fields };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2VudHJ5L2ZpZWxkcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFYSxRQUFBLE1BQU0sR0FBZ0I7SUFDakMsY0FBYyxFQUFFO1FBQ2QsSUFBSSxFQUFFLGtCQUFrQjtRQUN4QixLQUFLLEVBQUUsQ0FBQztRQUNSLFFBQVEsRUFBRSxDQUFDO1FBQ1gsUUFBUSxFQUFFLElBQUk7UUFDZCxJQUFJLEVBQUUsU0FBUztRQUNmLEtBQUssRUFBRSxHQUFHO0tBQ1g7SUFFRCxlQUFlLEVBQUU7UUFDZixJQUFJLEVBQUUsa0JBQWtCO1FBQ3hCLEtBQUssRUFBRSxDQUFDO1FBQ1IsUUFBUSxFQUFFLENBQUM7UUFDWCxRQUFRLEVBQUUsSUFBSTtRQUNkLElBQUksRUFBRSxTQUFTO0tBQ2hCO0lBRUQsWUFBWSxFQUFFO1FBQ1osSUFBSSxFQUFFLDhCQUFtRDtRQUN6RCxLQUFLLEVBQUUsQ0FBQztRQUNSLFFBQVEsRUFBRSxDQUFDO1FBQ1gsUUFBUSxFQUFFLElBQUk7UUFDZCxJQUFJLEVBQUUsU0FBUztRQUNmLEtBQUssRUFBRSxFQUFpQjtLQUN6QjtJQUVELFVBQVUsRUFBRTtRQUNWLElBQUksRUFBRSxhQUFhO1FBQ25CLEtBQUssRUFBRSxDQUFDO1FBQ1IsUUFBUSxFQUFFLENBQUM7UUFDWCxRQUFRLEVBQUUsSUFBSTtRQUNkLElBQUksRUFBRSxTQUFTO1FBQ2YsS0FBSyxFQUFFLEVBQWlCO0tBQ3pCO0lBRUQsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFLG9CQUF3QztRQUM5QyxLQUFLLEVBQUUsRUFBRTtRQUNULFFBQVEsRUFBRSxDQUFDO1FBQ1gsUUFBUSxFQUFFLElBQUk7UUFDZCxJQUFJLEVBQUUsY0FBYztRQUNwQixLQUFLLEVBQUUsRUFBRTtLQUNWO0lBRUQsTUFBTSxFQUFFO1FBQ04sSUFBSSxFQUFFLFFBQVE7UUFDZCxLQUFLLEVBQUUsRUFBRTtRQUNULFFBQVEsRUFBRSxDQUFDO1FBQ1gsUUFBUSxFQUFFLElBQUk7UUFDZCxJQUFJLEVBQUUsU0FBUztRQUNmLEtBQUssRUFBRSxFQUFFO1FBQ1QsTUFBTSxFQUFFLElBQUk7S0FDYjtJQUVELFFBQVEsRUFBRTtRQUNSLElBQUksRUFBRSxrQ0FBaUQ7UUFDdkQsS0FBSyxFQUFFLEVBQUU7UUFDVCxRQUFRLEVBQUUsQ0FBQztRQUNYLFFBQVEsRUFBRSxLQUFLO1FBQ2YsSUFBSSxFQUFFLGNBQWM7UUFDcEIsS0FBSyxFQUFFLEVBQUU7S0FDVjtJQUVELGNBQWMsRUFBRTtRQUNkLElBQUksRUFBRSxpQkFBaUI7UUFDdkIsS0FBSyxFQUFFLEVBQUU7UUFDVCxRQUFRLEVBQUUsQ0FBQztRQUNYLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLGNBQWM7UUFDcEIsS0FBSyxFQUFFLEVBQUU7S0FDVjtJQUVELGlCQUFpQixFQUFFO1FBQ2pCLElBQUksRUFBRSxvQkFBb0I7UUFDMUIsS0FBSyxFQUFFLENBQUM7UUFDUixRQUFRLEVBQUUsQ0FBQztRQUNYLFFBQVEsRUFBRSxLQUFLO1FBQ2YsSUFBSSxFQUFFLGNBQWM7UUFDcEIsS0FBSyxFQUFFLEVBQUU7S0FDVjtJQUVELFNBQVMsRUFBRTtRQUNULElBQUksRUFBRSwwQkFBMEM7UUFDaEQsS0FBSyxFQUFFLENBQUM7UUFDUixRQUFRLEVBQUUsRUFBRTtRQUNaLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLFNBQVM7UUFDZixLQUFLLEVBQUUsR0FBRztLQUNYO0lBRUQsV0FBVyxFQUFFO1FBQ1gsSUFBSSxFQUFFLGNBQWM7UUFDcEIsS0FBSyxFQUFFLEVBQUU7UUFDVCxRQUFRLEVBQUUsRUFBRTtRQUNaLFFBQVEsRUFBRSxLQUFLO1FBQ2YsSUFBSSxFQUFFLFNBQVM7UUFDZixLQUFLLEVBQUUsSUFBSTtRQUNYLEtBQUssRUFBRSxFQUFpQjtLQUN6QjtDQUNGLENBQUM7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLEVBQUUsTUFBTSxFQUFOLGNBQU0sRUFBRSxDQUFBIn0=