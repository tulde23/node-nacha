"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchHeaderDefaults = void 0;
exports.BatchHeaderDefaults = {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2JhdGNoL2hlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFYSxRQUFBLG1CQUFtQixHQUEyQjtJQUN6RCxjQUFjLEVBQUU7UUFDZCxJQUFJLEVBQUUsa0JBQWtCO1FBQ3hCLEtBQUssRUFBRSxDQUFDO1FBQ1IsUUFBUSxFQUFFLENBQUM7UUFDWCxRQUFRLEVBQUUsSUFBSTtRQUNkLElBQUksRUFBRSxTQUFTO1FBQ2YsS0FBSyxFQUFFLEdBQUc7S0FDWDtJQUVELGdCQUFnQixFQUFFO1FBQ2hCLElBQUksRUFBRSxvQkFBb0I7UUFDMUIsS0FBSyxFQUFFLENBQUM7UUFDUixRQUFRLEVBQUUsQ0FBQztRQUNYLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLFNBQVM7UUFDZixLQUFLLEVBQUUsRUFBaUI7S0FDekI7SUFFRCxXQUFXLEVBQUU7UUFDWCxJQUFJLEVBQUUsY0FBYztRQUNwQixLQUFLLEVBQUUsRUFBRTtRQUNULFFBQVEsRUFBRSxDQUFDO1FBQ1gsUUFBUSxFQUFFLElBQUk7UUFDZCxJQUFJLEVBQUUsY0FBYztRQUNwQixLQUFLLEVBQUUsRUFBRTtLQUNWO0lBRUQsd0JBQXdCLEVBQUU7UUFDeEIsSUFBSSxFQUFFLDRCQUE0QjtRQUNsQyxLQUFLLEVBQUUsRUFBRTtRQUNULFFBQVEsRUFBRSxDQUFDO1FBQ1gsUUFBUSxFQUFFLEtBQUs7UUFDZixJQUFJLEVBQUUsY0FBYztRQUNwQixLQUFLLEVBQUUsSUFBSTtRQUNYLEtBQUssRUFBRSxFQUFFO0tBQ1Y7SUFFRCxxQkFBcUIsRUFBRTtRQUNyQixJQUFJLEVBQUUsd0JBQXdCO1FBQzlCLEtBQUssRUFBRSxFQUFFO1FBQ1QsUUFBUSxFQUFFLENBQUM7UUFDWCxRQUFRLEVBQUUsSUFBSTtRQUNkLElBQUksRUFBRSxTQUFTO1FBQ2YsS0FBSyxFQUFFLEVBQUU7S0FDVjtJQUVELHNCQUFzQixFQUFFO1FBQ3RCLElBQUksRUFBRSwyQkFBMkI7UUFDakMsS0FBSyxFQUFFLENBQUM7UUFDUixRQUFRLEVBQUUsQ0FBQztRQUNYLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLE9BQU87UUFDYixLQUFLLEVBQUUsRUFBRTtLQUNWO0lBRUQsdUJBQXVCLEVBQUU7UUFDdkIsSUFBSSxFQUFFLDJCQUEyQjtRQUNqQyxLQUFLLEVBQUUsRUFBRTtRQUNULFFBQVEsRUFBRSxDQUFDO1FBQ1gsUUFBUSxFQUFFLElBQUk7UUFDZCxJQUFJLEVBQUUsY0FBYztRQUNwQixLQUFLLEVBQUUsRUFBRTtLQUNWO0lBRUQsc0JBQXNCLEVBQUU7UUFDdEIsSUFBSSxFQUFFLDBCQUEwQjtRQUNoQyxLQUFLLEVBQUUsQ0FBQztRQUNSLFFBQVEsRUFBRSxDQUFDO1FBQ1gsUUFBUSxFQUFFLEtBQUs7UUFDZixJQUFJLEVBQUUsY0FBYztRQUNwQixLQUFLLEVBQUUsRUFBRTtLQUNWO0lBRUQsa0JBQWtCLEVBQUU7UUFDbEIsSUFBSSxFQUFFLHNCQUFzQjtRQUM1QixLQUFLLEVBQUUsQ0FBQztRQUNSLFFBQVEsRUFBRSxDQUFDO1FBQ1gsUUFBUSxFQUFFLElBQUk7UUFDZCxJQUFJLEVBQUUsU0FBUztRQUNmLEtBQUssRUFBRSxFQUFFO0tBQ1Y7SUFFRCxjQUFjLEVBQUU7UUFDZCxJQUFJLEVBQUUsaUJBQWlCO1FBQ3ZCLEtBQUssRUFBRSxDQUFDO1FBQ1IsUUFBUSxFQUFFLEVBQUU7UUFDWixRQUFRLEVBQUUsS0FBSztRQUNmLElBQUksRUFBRSxTQUFTO1FBQ2YsS0FBSyxFQUFFLElBQUk7UUFDWCxLQUFLLEVBQUUsRUFBRTtLQUNWO0lBRUQsb0JBQW9CLEVBQUU7UUFDcEIsSUFBSSxFQUFFLHdCQUF3QjtRQUM5QixLQUFLLEVBQUUsQ0FBQztRQUNSLFFBQVEsRUFBRSxFQUFFO1FBQ1osUUFBUSxFQUFFLElBQUk7UUFDZCxJQUFJLEVBQUUsU0FBUztRQUNmLEtBQUssRUFBRSxHQUFHO0tBQ1g7SUFFRCxjQUFjLEVBQUU7UUFDZCxJQUFJLEVBQUUsaUJBQXdDO1FBQzlDLEtBQUssRUFBRSxDQUFDO1FBQ1IsUUFBUSxFQUFFLEVBQUU7UUFDWixRQUFRLEVBQUUsSUFBSTtRQUNkLElBQUksRUFBRSxTQUFTO1FBQ2YsS0FBSyxFQUFFLEVBQUU7S0FDVjtJQUVELFdBQVcsRUFBRTtRQUNYLElBQUksRUFBRSxjQUFjO1FBQ3BCLEtBQUssRUFBRSxDQUFDO1FBQ1IsUUFBUSxFQUFFLEVBQUU7UUFDWixRQUFRLEVBQUUsS0FBSztRQUNmLElBQUksRUFBRSxTQUFTO1FBQ2YsS0FBSyxFQUFFLENBQUM7S0FDVDtDQUNGLENBQUMifQ==