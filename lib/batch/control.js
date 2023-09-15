"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.control = void 0;
exports.control = {
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
module.exports = { control: exports.control };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJvbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iYXRjaC9jb250cm9sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVhLFFBQUEsT0FBTyxHQUFrQjtJQUNwQyxjQUFjLEVBQUU7UUFDZCxJQUFJLEVBQUUsa0JBQWtCO1FBQ3hCLEtBQUssRUFBRSxDQUFDO1FBQ1IsUUFBUSxFQUFFLENBQUM7UUFDWCxRQUFRLEVBQUUsSUFBSTtRQUNkLElBQUksRUFBRSxTQUFTO1FBQ2YsS0FBSyxFQUFFLEdBQUc7S0FDWDtJQUVELGdCQUFnQixFQUFFO1FBQ2hCLElBQUksRUFBRSxvQkFBb0I7UUFDMUIsS0FBSyxFQUFFLENBQUM7UUFDUixRQUFRLEVBQUUsQ0FBQztRQUNYLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLFNBQVM7UUFDZixLQUFLLEVBQUUsRUFBRTtLQUNWO0lBRUQsWUFBWSxFQUFFO1FBQ1osSUFBSSxFQUFFLGVBQWU7UUFDckIsS0FBSyxFQUFFLENBQUM7UUFDUixRQUFRLEVBQUUsQ0FBQztRQUNYLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLFNBQVM7UUFDZixLQUFLLEVBQUUsQ0FBQztLQUNUO0lBRUQsU0FBUyxFQUFFO1FBQ1QsSUFBSSxFQUFFLFlBQVk7UUFDbEIsS0FBSyxFQUFFLEVBQUU7UUFDVCxRQUFRLEVBQUUsQ0FBQztRQUNYLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLFNBQVM7UUFDZixLQUFLLEVBQUUsQ0FBQztLQUNUO0lBRUQsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFLGlDQUFrRDtRQUN4RCxLQUFLLEVBQUUsRUFBRTtRQUNULFFBQVEsRUFBRSxDQUFDO1FBQ1gsUUFBUSxFQUFFLElBQUk7UUFDZCxJQUFJLEVBQUUsU0FBUztRQUNmLEtBQUssRUFBRSxDQUFDO1FBQ1IsTUFBTSxFQUFFLElBQUk7S0FDYjtJQUVELFdBQVcsRUFBRTtRQUNYLElBQUksRUFBRSxrQ0FBb0Q7UUFDMUQsS0FBSyxFQUFFLEVBQUU7UUFDVCxRQUFRLEVBQUUsQ0FBQztRQUNYLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLFNBQVM7UUFDZixLQUFLLEVBQUUsQ0FBQztRQUNSLE1BQU0sRUFBRSxJQUFJO0tBQ2I7SUFFRCxxQkFBcUIsRUFBRTtRQUNyQixJQUFJLEVBQUUsd0JBQXdCO1FBQzlCLEtBQUssRUFBRSxFQUFFO1FBQ1QsUUFBUSxFQUFFLENBQUM7UUFDWCxRQUFRLEVBQUUsSUFBSTtRQUNkLElBQUksRUFBRSxTQUFTO0tBQ2hCO0lBRUQseUJBQXlCLEVBQUU7UUFDekIsSUFBSSxFQUFFLDZCQUE2QjtRQUNuQyxLQUFLLEVBQUUsRUFBRTtRQUNULFFBQVEsRUFBRSxDQUFDO1FBQ1gsUUFBUSxFQUFFLEtBQUs7UUFDZixJQUFJLEVBQUUsY0FBYztRQUNwQixLQUFLLEVBQUUsSUFBSTtRQUNYLEtBQUssRUFBRSxFQUFFO0tBQ1Y7SUFFRCxRQUFRLEVBQUU7UUFDUixJQUFJLEVBQUUsVUFBVTtRQUNoQixLQUFLLEVBQUUsQ0FBQztRQUNSLFFBQVEsRUFBRSxDQUFDO1FBQ1gsUUFBUSxFQUFFLEtBQUs7UUFDZixJQUFJLEVBQUUsY0FBYztRQUNwQixLQUFLLEVBQUUsSUFBSTtRQUNYLEtBQUssRUFBRSxFQUFFO0tBQ1Y7SUFFRCxjQUFjLEVBQUU7UUFDZCxJQUFJLEVBQUUsaUJBQXdDO1FBQzlDLEtBQUssRUFBRSxDQUFDO1FBQ1IsUUFBUSxFQUFFLEVBQUU7UUFDWixRQUFRLEVBQUUsSUFBSTtRQUNkLElBQUksRUFBRSxTQUFTO0tBQ2hCO0lBRUQsV0FBVyxFQUFFO1FBQ1gsSUFBSSxFQUFFLGNBQWM7UUFDcEIsS0FBSyxFQUFFLENBQUM7UUFDUixRQUFRLEVBQUUsRUFBRTtRQUNaLFFBQVEsRUFBRSxLQUFLO1FBQ2YsSUFBSSxFQUFFLFNBQVM7UUFDZixLQUFLLEVBQUUsQ0FBQztLQUNUO0NBQ0YsQ0FBQztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsRUFBRSxPQUFPLEVBQVAsZUFBTyxFQUFFLENBQUMifQ==