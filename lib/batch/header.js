"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.header = void 0;
exports.header = {
    recordTypeCode: {
        name: 'Record Type Code',
        width: 1,
        position: 1,
        required: true,
        type: 'numeric',
        value: '5'
    },
    serviceClassCode: {
        name: 'Service Class Code',
        width: 3,
        position: 2,
        required: true,
        type: 'numeric',
        value: ''
    },
    companyName: {
        name: 'Company Name',
        width: 16,
        position: 3,
        required: true,
        type: 'alphanumeric',
        value: ''
    },
    companyDiscretionaryData: {
        name: 'Company Discretionary Data',
        width: 20,
        position: 4,
        required: false,
        type: 'alphanumeric',
        blank: true,
        value: ''
    },
    companyIdentification: {
        name: 'Company Identification',
        width: 10,
        position: 5,
        required: true,
        type: 'numeric',
        value: ''
    },
    standardEntryClassCode: {
        name: 'Standard Entry Class Code',
        width: 3,
        position: 6,
        required: true,
        type: 'alpha',
        value: ''
    },
    companyEntryDescription: {
        name: 'Company Entry Description',
        width: 10,
        position: 7,
        required: true,
        type: 'alphanumeric',
        value: ''
    },
    companyDescriptiveDate: {
        name: 'Company Descriptive Date',
        width: 6,
        position: 8,
        required: false,
        type: 'alphanumeric',
        value: ''
    },
    effectiveEntryDate: {
        name: 'Effective Entry Date',
        width: 6,
        position: 9,
        required: true,
        type: 'numeric',
        value: ''
    },
    settlementDate: {
        name: 'Settlement Date',
        width: 3,
        position: 10,
        required: false,
        type: 'numeric',
        blank: true,
        value: ''
    },
    originatorStatusCode: {
        name: 'Originator Status Code',
        width: 1,
        position: 11,
        required: true,
        type: 'numeric',
        value: '1'
    },
    originatingDFI: {
        name: 'Originating DFI',
        width: 8,
        position: 12,
        required: true,
        type: 'numeric',
        value: ''
    },
    batchNumber: {
        name: 'Batch Number',
        width: 7,
        position: 13,
        required: false,
        type: 'numeric',
        value: 0
    }
};
module.exports = { header: exports.header };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2JhdGNoL2hlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFYSxRQUFBLE1BQU0sR0FBaUI7SUFDbEMsY0FBYyxFQUFFO1FBQ2QsSUFBSSxFQUFFLGtCQUFrQjtRQUN4QixLQUFLLEVBQUUsQ0FBQztRQUNSLFFBQVEsRUFBRSxDQUFDO1FBQ1gsUUFBUSxFQUFFLElBQUk7UUFDZCxJQUFJLEVBQUUsU0FBUztRQUNmLEtBQUssRUFBRSxHQUFHO0tBQ1g7SUFFRCxnQkFBZ0IsRUFBRTtRQUNoQixJQUFJLEVBQUUsb0JBQW9CO1FBQzFCLEtBQUssRUFBRSxDQUFDO1FBQ1IsUUFBUSxFQUFFLENBQUM7UUFDWCxRQUFRLEVBQUUsSUFBSTtRQUNkLElBQUksRUFBRSxTQUFTO1FBQ2YsS0FBSyxFQUFFLEVBQWlCO0tBQ3pCO0lBRUQsV0FBVyxFQUFFO1FBQ1gsSUFBSSxFQUFFLGNBQWM7UUFDcEIsS0FBSyxFQUFFLEVBQUU7UUFDVCxRQUFRLEVBQUUsQ0FBQztRQUNYLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLGNBQWM7UUFDcEIsS0FBSyxFQUFFLEVBQUU7S0FDVjtJQUVELHdCQUF3QixFQUFFO1FBQ3hCLElBQUksRUFBRSw0QkFBNEI7UUFDbEMsS0FBSyxFQUFFLEVBQUU7UUFDVCxRQUFRLEVBQUUsQ0FBQztRQUNYLFFBQVEsRUFBRSxLQUFLO1FBQ2YsSUFBSSxFQUFFLGNBQWM7UUFDcEIsS0FBSyxFQUFFLElBQUk7UUFDWCxLQUFLLEVBQUUsRUFBRTtLQUNWO0lBRUQscUJBQXFCLEVBQUU7UUFDckIsSUFBSSxFQUFFLHdCQUF3QjtRQUM5QixLQUFLLEVBQUUsRUFBRTtRQUNULFFBQVEsRUFBRSxDQUFDO1FBQ1gsUUFBUSxFQUFFLElBQUk7UUFDZCxJQUFJLEVBQUUsU0FBUztRQUNmLEtBQUssRUFBRSxFQUFFO0tBQ1Y7SUFFRCxzQkFBc0IsRUFBRTtRQUN0QixJQUFJLEVBQUUsMkJBQTJCO1FBQ2pDLEtBQUssRUFBRSxDQUFDO1FBQ1IsUUFBUSxFQUFFLENBQUM7UUFDWCxRQUFRLEVBQUUsSUFBSTtRQUNkLElBQUksRUFBRSxPQUFPO1FBQ2IsS0FBSyxFQUFFLEVBQUU7S0FDVjtJQUVELHVCQUF1QixFQUFFO1FBQ3ZCLElBQUksRUFBRSwyQkFBMkI7UUFDakMsS0FBSyxFQUFFLEVBQUU7UUFDVCxRQUFRLEVBQUUsQ0FBQztRQUNYLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLGNBQWM7UUFDcEIsS0FBSyxFQUFFLEVBQUU7S0FDVjtJQUVELHNCQUFzQixFQUFFO1FBQ3RCLElBQUksRUFBRSwwQkFBMEI7UUFDaEMsS0FBSyxFQUFFLENBQUM7UUFDUixRQUFRLEVBQUUsQ0FBQztRQUNYLFFBQVEsRUFBRSxLQUFLO1FBQ2YsSUFBSSxFQUFFLGNBQWM7UUFDcEIsS0FBSyxFQUFFLEVBQUU7S0FDVjtJQUVELGtCQUFrQixFQUFFO1FBQ2xCLElBQUksRUFBRSxzQkFBc0I7UUFDNUIsS0FBSyxFQUFFLENBQUM7UUFDUixRQUFRLEVBQUUsQ0FBQztRQUNYLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLFNBQVM7UUFDZixLQUFLLEVBQUUsRUFBRTtLQUNWO0lBRUQsY0FBYyxFQUFFO1FBQ2QsSUFBSSxFQUFFLGlCQUFpQjtRQUN2QixLQUFLLEVBQUUsQ0FBQztRQUNSLFFBQVEsRUFBRSxFQUFFO1FBQ1osUUFBUSxFQUFFLEtBQUs7UUFDZixJQUFJLEVBQUUsU0FBUztRQUNmLEtBQUssRUFBRSxJQUFJO1FBQ1gsS0FBSyxFQUFFLEVBQUU7S0FDVjtJQUVELG9CQUFvQixFQUFFO1FBQ3BCLElBQUksRUFBRSx3QkFBd0I7UUFDOUIsS0FBSyxFQUFFLENBQUM7UUFDUixRQUFRLEVBQUUsRUFBRTtRQUNaLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLFNBQVM7UUFDZixLQUFLLEVBQUUsR0FBRztLQUNYO0lBRUQsY0FBYyxFQUFFO1FBQ2QsSUFBSSxFQUFFLGlCQUF3QztRQUM5QyxLQUFLLEVBQUUsQ0FBQztRQUNSLFFBQVEsRUFBRSxFQUFFO1FBQ1osUUFBUSxFQUFFLElBQUk7UUFDZCxJQUFJLEVBQUUsU0FBUztRQUNmLEtBQUssRUFBRSxFQUFFO0tBQ1Y7SUFFRCxXQUFXLEVBQUU7UUFDWCxJQUFJLEVBQUUsY0FBYztRQUNwQixLQUFLLEVBQUUsQ0FBQztRQUNSLFFBQVEsRUFBRSxFQUFFO1FBQ1osUUFBUSxFQUFFLEtBQUs7UUFDZixJQUFJLEVBQUUsU0FBUztRQUNmLEtBQUssRUFBRSxDQUFDO0tBQ1Q7Q0FDRixDQUFDO0FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRyxFQUFFLE1BQU0sRUFBTixjQUFNLEVBQUUsQ0FBQyJ9