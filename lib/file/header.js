"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileHeaders = void 0;
const utils_1 = require("../utils");
// The date/time defaults are dynamic, so always create a new object
const fileHead = () => {
    return {
        recordTypeCode: {
            name: 'Record Type Code',
            width: 1,
            position: 1,
            required: true,
            type: 'numeric',
            value: '1'
        },
        priorityCode: {
            name: 'Priority Code',
            width: 2,
            position: 2,
            required: true,
            type: 'numeric',
            value: '01'
        },
        immediateDestination: {
            name: 'Immediate Destination',
            width: 10,
            position: 3,
            required: true,
            type: 'ABA',
            paddingChar: ' ',
            value: ''
        },
        immediateOrigin: {
            name: 'Immediate Origin',
            width: 10,
            position: 4,
            required: true,
            type: 'numeric',
            paddingChar: ' ',
            value: ''
        },
        fileCreationDate: {
            name: 'File Creation Date',
            width: 6,
            position: 5,
            required: true,
            type: 'numeric',
            value: (0, utils_1.formatDateToYYMMDD)(new Date())
        },
        fileCreationTime: {
            name: 'File Creation Time',
            width: 4,
            position: 6,
            required: true,
            type: 'numeric',
            value: (0, utils_1.formatTime)(new Date())
        },
        fileIdModifier: {
            name: 'File Modifier',
            width: 1,
            position: 7,
            required: true,
            type: 'alphanumeric',
            value: 'A'
        },
        recordSize: {
            name: 'Record Size',
            width: 3,
            position: 8,
            type: 'numeric',
            required: true,
            value: '094'
        },
        blockingFactor: {
            name: 'Blocking Factor',
            width: 2,
            position: 9,
            type: 'numeric',
            required: true,
            value: '10'
        },
        formatCode: {
            name: 'Format Code',
            width: 1,
            position: 10,
            required: true,
            type: 'numeric',
            value: '1'
        },
        immediateDestinationName: {
            name: 'Immediate Destination Name',
            width: 23,
            position: 11,
            required: true,
            type: 'alphanumeric',
            value: ''
        },
        immediateOriginName: {
            name: 'Immediate Origin Name',
            width: 23,
            position: 12,
            required: true,
            type: 'alphanumeric',
            value: ''
        },
        referenceCode: {
            name: 'Reference Code',
            width: 8,
            position: 13,
            required: true,
            type: 'alphanumeric',
            value: ''
        }
    };
};
exports.fileHeaders = fileHead();
module.exports = { fileHeaders: exports.fileHeaders };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ZpbGUvaGVhZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG9DQUEwRDtBQUcxRCxvRUFBb0U7QUFDcEUsTUFBTSxRQUFRLEdBQUcsR0FBZ0IsRUFBRTtJQUNqQyxPQUFPO1FBQ0wsY0FBYyxFQUFFO1lBQ2QsSUFBSSxFQUFFLGtCQUFrQjtZQUN4QixLQUFLLEVBQUUsQ0FBQztZQUNSLFFBQVEsRUFBRSxDQUFDO1lBQ1gsUUFBUSxFQUFFLElBQUk7WUFDZCxJQUFJLEVBQUUsU0FBUztZQUNmLEtBQUssRUFBRSxHQUFHO1NBQ1g7UUFFRCxZQUFZLEVBQUU7WUFDWixJQUFJLEVBQUUsZUFBZTtZQUNyQixLQUFLLEVBQUUsQ0FBQztZQUNSLFFBQVEsRUFBRSxDQUFDO1lBQ1gsUUFBUSxFQUFFLElBQUk7WUFDZCxJQUFJLEVBQUUsU0FBUztZQUNmLEtBQUssRUFBRSxJQUFJO1NBQ1o7UUFFRCxvQkFBb0IsRUFBRTtZQUNwQixJQUFJLEVBQUUsdUJBQXVCO1lBQzdCLEtBQUssRUFBRSxFQUFFO1lBQ1QsUUFBUSxFQUFFLENBQUM7WUFDWCxRQUFRLEVBQUUsSUFBSTtZQUNkLElBQUksRUFBRSxLQUFLO1lBQ1gsV0FBVyxFQUFFLEdBQUc7WUFDaEIsS0FBSyxFQUFFLEVBQUU7U0FDVjtRQUVELGVBQWUsRUFBRTtZQUNmLElBQUksRUFBRSxrQkFBa0I7WUFDeEIsS0FBSyxFQUFFLEVBQUU7WUFDVCxRQUFRLEVBQUUsQ0FBQztZQUNYLFFBQVEsRUFBRSxJQUFJO1lBQ2QsSUFBSSxFQUFFLFNBQVM7WUFDZixXQUFXLEVBQUUsR0FBRztZQUNoQixLQUFLLEVBQUUsRUFBRTtTQUNWO1FBRUQsZ0JBQWdCLEVBQUU7WUFDaEIsSUFBSSxFQUFFLG9CQUFvQjtZQUMxQixLQUFLLEVBQUUsQ0FBQztZQUNSLFFBQVEsRUFBRSxDQUFDO1lBQ1gsUUFBUSxFQUFFLElBQUk7WUFDZCxJQUFJLEVBQUUsU0FBUztZQUNmLEtBQUssRUFBRSxJQUFBLDBCQUFrQixFQUFDLElBQUksSUFBSSxFQUFFLENBQUM7U0FDdEM7UUFFRCxnQkFBZ0IsRUFBRTtZQUNoQixJQUFJLEVBQUUsb0JBQW9CO1lBQzFCLEtBQUssRUFBRSxDQUFDO1lBQ1IsUUFBUSxFQUFFLENBQUM7WUFDWCxRQUFRLEVBQUUsSUFBSTtZQUNkLElBQUksRUFBRSxTQUFTO1lBQ2YsS0FBSyxFQUFFLElBQUEsa0JBQVUsRUFBQyxJQUFJLElBQUksRUFBRSxDQUFDO1NBQzlCO1FBRUQsY0FBYyxFQUFFO1lBQ2QsSUFBSSxFQUFFLGVBQXFDO1lBQzNDLEtBQUssRUFBRSxDQUFDO1lBQ1IsUUFBUSxFQUFFLENBQUM7WUFDWCxRQUFRLEVBQUUsSUFBSTtZQUNkLElBQUksRUFBRSxjQUFjO1lBQ3BCLEtBQUssRUFBRSxHQUFHO1NBQ1g7UUFFRCxVQUFVLEVBQUU7WUFDVixJQUFJLEVBQUUsYUFBYTtZQUNuQixLQUFLLEVBQUUsQ0FBQztZQUNSLFFBQVEsRUFBRSxDQUFDO1lBQ1gsSUFBSSxFQUFFLFNBQVM7WUFDZixRQUFRLEVBQUUsSUFBSTtZQUNkLEtBQUssRUFBRSxLQUFLO1NBQ2I7UUFFRCxjQUFjLEVBQUU7WUFDZCxJQUFJLEVBQUUsaUJBQWlCO1lBQ3ZCLEtBQUssRUFBRSxDQUFDO1lBQ1IsUUFBUSxFQUFFLENBQUM7WUFDWCxJQUFJLEVBQUUsU0FBUztZQUNmLFFBQVEsRUFBRSxJQUFJO1lBQ2QsS0FBSyxFQUFFLElBQUk7U0FDWjtRQUVELFVBQVUsRUFBRTtZQUNWLElBQUksRUFBRSxhQUFhO1lBQ25CLEtBQUssRUFBRSxDQUFDO1lBQ1IsUUFBUSxFQUFFLEVBQUU7WUFDWixRQUFRLEVBQUUsSUFBSTtZQUNkLElBQUksRUFBRSxTQUFTO1lBQ2YsS0FBSyxFQUFFLEdBQUc7U0FDWDtRQUVELHdCQUF3QixFQUFFO1lBQ3hCLElBQUksRUFBRSw0QkFBNEI7WUFDbEMsS0FBSyxFQUFFLEVBQUU7WUFDVCxRQUFRLEVBQUUsRUFBRTtZQUNaLFFBQVEsRUFBRSxJQUFJO1lBQ2QsSUFBSSxFQUFFLGNBQWM7WUFDcEIsS0FBSyxFQUFFLEVBQUU7U0FDVjtRQUVELG1CQUFtQixFQUFFO1lBQ25CLElBQUksRUFBRSx1QkFBdUI7WUFDN0IsS0FBSyxFQUFFLEVBQUU7WUFDVCxRQUFRLEVBQUUsRUFBRTtZQUNaLFFBQVEsRUFBRSxJQUFJO1lBQ2QsSUFBSSxFQUFFLGNBQWM7WUFDcEIsS0FBSyxFQUFFLEVBQUU7U0FDVjtRQUVELGFBQWEsRUFBRTtZQUNiLElBQUksRUFBRSxnQkFBZ0I7WUFDdEIsS0FBSyxFQUFFLENBQUM7WUFDUixRQUFRLEVBQUUsRUFBRTtZQUNaLFFBQVEsRUFBRSxJQUFJO1lBQ2QsSUFBSSxFQUFFLGNBQWM7WUFDcEIsS0FBSyxFQUFFLEVBQUU7U0FDVjtLQUNGLENBQUM7QUFDSixDQUFDLENBQUM7QUFFVyxRQUFBLFdBQVcsR0FBRyxRQUFRLEVBQUUsQ0FBQztBQUN0QyxNQUFNLENBQUMsT0FBTyxHQUFHLEVBQUUsV0FBVyxFQUFYLG1CQUFXLEVBQUUsQ0FBQyJ9