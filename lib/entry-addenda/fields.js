"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddendaFieldDefaults = void 0;
exports.AddendaFieldDefaults = {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2VudHJ5LWFkZGVuZGEvZmllbGRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUdhLFFBQUEsb0JBQW9CLEdBQTBDO0lBQ3pFLGNBQWMsRUFBRTtRQUNkLElBQUksRUFBRSxrQkFBa0I7UUFDeEIsS0FBSyxFQUFFLENBQUM7UUFDUixRQUFRLEVBQUUsQ0FBQztRQUNYLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLFNBQVM7UUFDZixLQUFLLEVBQUUsR0FBRztLQUNYO0lBRUQsZUFBZSxFQUFFO1FBQ2YsSUFBSSxFQUFFLG1CQUFtQjtRQUN6QixLQUFLLEVBQUUsQ0FBQztRQUNSLFFBQVEsRUFBRSxDQUFDO1FBQ1gsUUFBUSxFQUFFLElBQUk7UUFDZCxJQUFJLEVBQUUsU0FBUztRQUNmLEtBQUssRUFBRSxJQUFJO0tBQ1o7SUFFRCx5QkFBeUIsRUFBRTtRQUN6QixJQUFJLEVBQUUsNkJBQTZCO1FBQ25DLEtBQUssRUFBRSxFQUFFO1FBQ1QsUUFBUSxFQUFFLENBQUM7UUFDWCxRQUFRLEVBQUUsS0FBSztRQUNmLElBQUksRUFBRSxjQUFjO1FBQ3BCLEtBQUssRUFBRSxFQUFFO0tBQ1Y7SUFFRCxxQkFBcUIsRUFBRTtRQUNyQixJQUFJLEVBQUUseUJBQXlCO1FBQy9CLEtBQUssRUFBRSxDQUFDO1FBQ1IsUUFBUSxFQUFFLENBQUM7UUFDWCxRQUFRLEVBQUUsSUFBSTtRQUNkLElBQUksRUFBRSxTQUFTO1FBQ2YsS0FBSyxFQUFFLENBQUM7UUFDUixNQUFNLEVBQUUsSUFBSTtLQUNiO0lBRUQseUJBQXlCLEVBQUU7UUFDekIsSUFBSSxFQUFFLDhCQUE4QjtRQUNwQyxLQUFLLEVBQUUsQ0FBQztRQUNSLFFBQVEsRUFBRSxDQUFDO1FBQ1gsUUFBUSxFQUFFLEtBQUs7UUFDZixJQUFJLEVBQUUsU0FBUztRQUNmLEtBQUssRUFBRSxJQUFJO1FBQ1gsS0FBSyxFQUFFLEVBQXFCO0tBQzdCO0NBQ0YsQ0FBQyJ9