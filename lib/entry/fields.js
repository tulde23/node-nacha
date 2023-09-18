"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntryFieldDefaults = void 0;
exports.EntryFieldDefaults = {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2VudHJ5L2ZpZWxkcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFYSxRQUFBLGtCQUFrQixHQUEwQjtJQUN2RCxjQUFjLEVBQUU7UUFDZCxJQUFJLEVBQUUsa0JBQWtCO1FBQ3hCLEtBQUssRUFBRSxDQUFDO1FBQ1IsUUFBUSxFQUFFLENBQUM7UUFDWCxRQUFRLEVBQUUsSUFBSTtRQUNkLElBQUksRUFBRSxTQUFTO1FBQ2YsS0FBSyxFQUFFLEdBQUc7S0FDWDtJQUVELGVBQWUsRUFBRTtRQUNmLElBQUksRUFBRSxrQkFBa0I7UUFDeEIsS0FBSyxFQUFFLENBQUM7UUFDUixRQUFRLEVBQUUsQ0FBQztRQUNYLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLFNBQVM7S0FDaEI7SUFFRCxZQUFZLEVBQUU7UUFDWixJQUFJLEVBQUUsOEJBQW1EO1FBQ3pELEtBQUssRUFBRSxDQUFDO1FBQ1IsUUFBUSxFQUFFLENBQUM7UUFDWCxRQUFRLEVBQUUsSUFBSTtRQUNkLElBQUksRUFBRSxTQUFTO1FBQ2YsS0FBSyxFQUFFLEVBQWlCO0tBQ3pCO0lBRUQsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFLGFBQWE7UUFDbkIsS0FBSyxFQUFFLENBQUM7UUFDUixRQUFRLEVBQUUsQ0FBQztRQUNYLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLFNBQVM7UUFDZixLQUFLLEVBQUUsRUFBaUI7S0FDekI7SUFFRCxVQUFVLEVBQUU7UUFDVixJQUFJLEVBQUUsb0JBQXdDO1FBQzlDLEtBQUssRUFBRSxFQUFFO1FBQ1QsUUFBUSxFQUFFLENBQUM7UUFDWCxRQUFRLEVBQUUsSUFBSTtRQUNkLElBQUksRUFBRSxjQUFjO1FBQ3BCLEtBQUssRUFBRSxFQUFFO0tBQ1Y7SUFFRCxNQUFNLEVBQUU7UUFDTixJQUFJLEVBQUUsUUFBUTtRQUNkLEtBQUssRUFBRSxFQUFFO1FBQ1QsUUFBUSxFQUFFLENBQUM7UUFDWCxRQUFRLEVBQUUsSUFBSTtRQUNkLElBQUksRUFBRSxTQUFTO1FBQ2YsS0FBSyxFQUFFLEVBQUU7UUFDVCxNQUFNLEVBQUUsSUFBSTtLQUNiO0lBRUQsUUFBUSxFQUFFO1FBQ1IsSUFBSSxFQUFFLGtDQUFpRDtRQUN2RCxLQUFLLEVBQUUsRUFBRTtRQUNULFFBQVEsRUFBRSxDQUFDO1FBQ1gsUUFBUSxFQUFFLEtBQUs7UUFDZixJQUFJLEVBQUUsY0FBYztRQUNwQixLQUFLLEVBQUUsRUFBRTtLQUNWO0lBRUQsY0FBYyxFQUFFO1FBQ2QsSUFBSSxFQUFFLGlCQUFpQjtRQUN2QixLQUFLLEVBQUUsRUFBRTtRQUNULFFBQVEsRUFBRSxDQUFDO1FBQ1gsUUFBUSxFQUFFLElBQUk7UUFDZCxJQUFJLEVBQUUsY0FBYztRQUNwQixLQUFLLEVBQUUsRUFBRTtLQUNWO0lBRUQsaUJBQWlCLEVBQUU7UUFDakIsSUFBSSxFQUFFLG9CQUFvQjtRQUMxQixLQUFLLEVBQUUsQ0FBQztRQUNSLFFBQVEsRUFBRSxDQUFDO1FBQ1gsUUFBUSxFQUFFLEtBQUs7UUFDZixJQUFJLEVBQUUsY0FBYztRQUNwQixLQUFLLEVBQUUsRUFBRTtLQUNWO0lBRUQsU0FBUyxFQUFFO1FBQ1QsSUFBSSxFQUFFLDBCQUEwQztRQUNoRCxLQUFLLEVBQUUsQ0FBQztRQUNSLFFBQVEsRUFBRSxFQUFFO1FBQ1osUUFBUSxFQUFFLElBQUk7UUFDZCxJQUFJLEVBQUUsU0FBUztRQUNmLEtBQUssRUFBRSxHQUFHO0tBQ1g7SUFFRCxXQUFXLEVBQUU7UUFDWCxJQUFJLEVBQUUsY0FBYztRQUNwQixLQUFLLEVBQUUsRUFBRTtRQUNULFFBQVEsRUFBRSxFQUFFO1FBQ1osUUFBUSxFQUFFLEtBQUs7UUFDZixJQUFJLEVBQUUsU0FBUztRQUNmLEtBQUssRUFBRSxJQUFJO1FBQ1gsS0FBSyxFQUFFLEVBQWlCO0tBQ3pCO0NBQ0YsQ0FBQyJ9