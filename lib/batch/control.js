"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchControlDefaults = void 0;
exports.BatchControlDefaults = {
    recordTypeCode: {
        name: 'Record Type Code',
        width: 1,
        position: 1,
        required: true,
        type: 'numeric',
        value: '8'
    },
    serviceClassCode: {
        name: 'Service Class Code',
        width: 3,
        position: 2,
        required: true,
        type: 'numeric',
        value: ''
    },
    addendaCount: {
        name: 'Addenda Count',
        width: 6,
        position: 3,
        required: true,
        type: 'numeric',
        value: 0
    },
    entryHash: {
        name: 'Entry Hash',
        width: 10,
        position: 4,
        required: true,
        type: 'numeric',
        value: 0
    },
    totalDebit: {
        name: 'Total Debit Entry Dollar Amount',
        width: 12,
        position: 5,
        required: true,
        type: 'numeric',
        value: 0,
        number: true
    },
    totalCredit: {
        name: 'Total Credit Entry Dollar Amount',
        width: 12,
        position: 6,
        required: true,
        type: 'numeric',
        value: 0,
        number: true
    },
    companyIdentification: {
        name: 'Company Identification',
        width: 10,
        position: 7,
        required: true,
        type: 'numeric'
    },
    messageAuthenticationCode: {
        name: 'Message Authentication Code',
        width: 19,
        position: 8,
        required: false,
        type: 'alphanumeric',
        blank: true,
        value: ''
    },
    reserved: {
        name: 'Reserved',
        width: 6,
        position: 9,
        required: false,
        type: 'alphanumeric',
        blank: true,
        value: ''
    },
    originatingDFI: {
        name: 'Originating DFI',
        width: 8,
        position: 10,
        required: true,
        type: 'numeric'
    },
    batchNumber: {
        name: 'Batch Number',
        width: 7,
        position: 11,
        required: false,
        type: 'numeric',
        value: 8
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJvbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iYXRjaC9jb250cm9sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVhLFFBQUEsb0JBQW9CLEdBQTRCO0lBQzNELGNBQWMsRUFBRTtRQUNkLElBQUksRUFBRSxrQkFBa0I7UUFDeEIsS0FBSyxFQUFFLENBQUM7UUFDUixRQUFRLEVBQUUsQ0FBQztRQUNYLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLFNBQVM7UUFDZixLQUFLLEVBQUUsR0FBRztLQUNYO0lBRUQsZ0JBQWdCLEVBQUU7UUFDaEIsSUFBSSxFQUFFLG9CQUFvQjtRQUMxQixLQUFLLEVBQUUsQ0FBQztRQUNSLFFBQVEsRUFBRSxDQUFDO1FBQ1gsUUFBUSxFQUFFLElBQUk7UUFDZCxJQUFJLEVBQUUsU0FBUztRQUNmLEtBQUssRUFBRSxFQUFFO0tBQ1Y7SUFFRCxZQUFZLEVBQUU7UUFDWixJQUFJLEVBQUUsZUFBZTtRQUNyQixLQUFLLEVBQUUsQ0FBQztRQUNSLFFBQVEsRUFBRSxDQUFDO1FBQ1gsUUFBUSxFQUFFLElBQUk7UUFDZCxJQUFJLEVBQUUsU0FBUztRQUNmLEtBQUssRUFBRSxDQUFDO0tBQ1Q7SUFFRCxTQUFTLEVBQUU7UUFDVCxJQUFJLEVBQUUsWUFBWTtRQUNsQixLQUFLLEVBQUUsRUFBRTtRQUNULFFBQVEsRUFBRSxDQUFDO1FBQ1gsUUFBUSxFQUFFLElBQUk7UUFDZCxJQUFJLEVBQUUsU0FBUztRQUNmLEtBQUssRUFBRSxDQUFDO0tBQ1Q7SUFFRCxVQUFVLEVBQUU7UUFDVixJQUFJLEVBQUUsaUNBQWtEO1FBQ3hELEtBQUssRUFBRSxFQUFFO1FBQ1QsUUFBUSxFQUFFLENBQUM7UUFDWCxRQUFRLEVBQUUsSUFBSTtRQUNkLElBQUksRUFBRSxTQUFTO1FBQ2YsS0FBSyxFQUFFLENBQUM7UUFDUixNQUFNLEVBQUUsSUFBSTtLQUNiO0lBRUQsV0FBVyxFQUFFO1FBQ1gsSUFBSSxFQUFFLGtDQUFvRDtRQUMxRCxLQUFLLEVBQUUsRUFBRTtRQUNULFFBQVEsRUFBRSxDQUFDO1FBQ1gsUUFBUSxFQUFFLElBQUk7UUFDZCxJQUFJLEVBQUUsU0FBUztRQUNmLEtBQUssRUFBRSxDQUFDO1FBQ1IsTUFBTSxFQUFFLElBQUk7S0FDYjtJQUVELHFCQUFxQixFQUFFO1FBQ3JCLElBQUksRUFBRSx3QkFBd0I7UUFDOUIsS0FBSyxFQUFFLEVBQUU7UUFDVCxRQUFRLEVBQUUsQ0FBQztRQUNYLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLFNBQVM7S0FDaEI7SUFFRCx5QkFBeUIsRUFBRTtRQUN6QixJQUFJLEVBQUUsNkJBQTZCO1FBQ25DLEtBQUssRUFBRSxFQUFFO1FBQ1QsUUFBUSxFQUFFLENBQUM7UUFDWCxRQUFRLEVBQUUsS0FBSztRQUNmLElBQUksRUFBRSxjQUFjO1FBQ3BCLEtBQUssRUFBRSxJQUFJO1FBQ1gsS0FBSyxFQUFFLEVBQUU7S0FDVjtJQUVELFFBQVEsRUFBRTtRQUNSLElBQUksRUFBRSxVQUFVO1FBQ2hCLEtBQUssRUFBRSxDQUFDO1FBQ1IsUUFBUSxFQUFFLENBQUM7UUFDWCxRQUFRLEVBQUUsS0FBSztRQUNmLElBQUksRUFBRSxjQUFjO1FBQ3BCLEtBQUssRUFBRSxJQUFJO1FBQ1gsS0FBSyxFQUFFLEVBQUU7S0FDVjtJQUVELGNBQWMsRUFBRTtRQUNkLElBQUksRUFBRSxpQkFBd0M7UUFDOUMsS0FBSyxFQUFFLENBQUM7UUFDUixRQUFRLEVBQUUsRUFBRTtRQUNaLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLFNBQVM7S0FDaEI7SUFFRCxXQUFXLEVBQUU7UUFDWCxJQUFJLEVBQUUsY0FBYztRQUNwQixLQUFLLEVBQUUsQ0FBQztRQUNSLFFBQVEsRUFBRSxFQUFFO1FBQ1osUUFBUSxFQUFFLEtBQUs7UUFDZixJQUFJLEVBQUUsU0FBUztRQUNmLEtBQUssRUFBRSxDQUFDO0tBQ1Q7Q0FDRixDQUFDIn0=