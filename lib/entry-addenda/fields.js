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
        value: '7'
    },
    addendaTypeCode: {
        name: 'Addenda Type Code',
        width: 2,
        position: 2,
        required: true,
        type: 'numeric',
        value: '05'
    },
    paymentRelatedInformation: {
        name: 'Payment Related Information',
        width: 80,
        position: 3,
        required: false,
        type: 'alphanumeric',
        value: ''
    },
    addendaSequenceNumber: {
        name: 'Addenda Sequence Number',
        width: 4,
        position: 4,
        required: true,
        type: 'numeric',
        value: 1,
        number: true
    },
    entryDetailSequenceNumber: {
        name: 'Entry Detail Sequence Number',
        width: 7,
        position: 5,
        required: false,
        type: 'numeric',
        blank: true,
        value: ''
    }
};
module.exports = { fields: exports.fields };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2VudHJ5LWFkZGVuZGEvZmllbGRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUdhLFFBQUEsTUFBTSxHQUFnQztJQUNqRCxjQUFjLEVBQUU7UUFDZCxJQUFJLEVBQUUsa0JBQWtCO1FBQ3hCLEtBQUssRUFBRSxDQUFDO1FBQ1IsUUFBUSxFQUFFLENBQUM7UUFDWCxRQUFRLEVBQUUsSUFBSTtRQUNkLElBQUksRUFBRSxTQUFTO1FBQ2YsS0FBSyxFQUFFLEdBQUc7S0FDWDtJQUVELGVBQWUsRUFBRTtRQUNmLElBQUksRUFBRSxtQkFBbUI7UUFDekIsS0FBSyxFQUFFLENBQUM7UUFDUixRQUFRLEVBQUUsQ0FBQztRQUNYLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLFNBQVM7UUFDZixLQUFLLEVBQUUsSUFBSTtLQUNaO0lBRUQseUJBQXlCLEVBQUU7UUFDekIsSUFBSSxFQUFFLDZCQUE2QjtRQUNuQyxLQUFLLEVBQUUsRUFBRTtRQUNULFFBQVEsRUFBRSxDQUFDO1FBQ1gsUUFBUSxFQUFFLEtBQUs7UUFDZixJQUFJLEVBQUUsY0FBYztRQUNwQixLQUFLLEVBQUUsRUFBRTtLQUNWO0lBRUQscUJBQXFCLEVBQUU7UUFDckIsSUFBSSxFQUFFLHlCQUF5QjtRQUMvQixLQUFLLEVBQUUsQ0FBQztRQUNSLFFBQVEsRUFBRSxDQUFDO1FBQ1gsUUFBUSxFQUFFLElBQUk7UUFDZCxJQUFJLEVBQUUsU0FBUztRQUNmLEtBQUssRUFBRSxDQUFDO1FBQ1IsTUFBTSxFQUFFLElBQUk7S0FDYjtJQUVELHlCQUF5QixFQUFFO1FBQ3pCLElBQUksRUFBRSw4QkFBOEI7UUFDcEMsS0FBSyxFQUFFLENBQUM7UUFDUixRQUFRLEVBQUUsQ0FBQztRQUNYLFFBQVEsRUFBRSxLQUFLO1FBQ2YsSUFBSSxFQUFFLFNBQVM7UUFDZixLQUFLLEVBQUUsSUFBSTtRQUNYLEtBQUssRUFBRSxFQUFxQjtLQUM3QjtDQUNGLENBQUM7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLEVBQUUsTUFBTSxFQUFOLGNBQU0sRUFBRSxDQUFDIn0=