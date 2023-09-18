"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileControlDefaults = void 0;
exports.FileControlDefaults = {
    recordTypeCode: {
        name: 'Record Type Code',
        width: 1,
        position: 1,
        type: 'numeric',
        value: '9'
    },
    batchCount: {
        name: 'Batch Count',
        width: 6,
        position: 2,
        type: 'numeric',
        value: 0
    },
    blockCount: {
        name: 'Block Count',
        width: 6,
        position: 3,
        type: 'numeric',
        value: 0
    },
    addendaCount: {
        name: 'Addenda Count',
        width: 8,
        position: 4,
        type: 'numeric',
        value: 0
    },
    entryHash: {
        name: 'Entry Hash',
        width: 10,
        position: 5,
        type: 'numeric',
        value: 0
    },
    totalDebit: {
        name: 'Total Debit Entry Dollar Amount in File',
        width: 12,
        position: 6,
        type: 'numeric',
        value: 0,
        number: true
    },
    totalCredit: {
        name: 'Total Credit Entry Dollar Amount in File',
        width: 12,
        position: 7,
        type: 'numeric',
        value: 0,
        number: true
    },
    reserved: {
        name: 'Reserved',
        width: 39,
        position: 8,
        type: 'alphanumeric',
        blank: true,
        value: ''
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJvbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9maWxlL2NvbnRyb2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRWEsUUFBQSxtQkFBbUIsR0FBMkI7SUFDekQsY0FBYyxFQUFFO1FBQ2QsSUFBSSxFQUFFLGtCQUFrQjtRQUN4QixLQUFLLEVBQUUsQ0FBQztRQUNSLFFBQVEsRUFBRSxDQUFDO1FBQ1gsSUFBSSxFQUFFLFNBQVM7UUFDZixLQUFLLEVBQUUsR0FBRztLQUNYO0lBRUQsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFLGFBQWE7UUFDbkIsS0FBSyxFQUFFLENBQUM7UUFDUixRQUFRLEVBQUUsQ0FBQztRQUNYLElBQUksRUFBRSxTQUFTO1FBQ2YsS0FBSyxFQUFFLENBQUM7S0FDVDtJQUVELFVBQVUsRUFBRTtRQUNWLElBQUksRUFBRSxhQUFhO1FBQ25CLEtBQUssRUFBRSxDQUFDO1FBQ1IsUUFBUSxFQUFFLENBQUM7UUFDWCxJQUFJLEVBQUUsU0FBUztRQUNmLEtBQUssRUFBRSxDQUFDO0tBQ1Q7SUFFRCxZQUFZLEVBQUU7UUFDWixJQUFJLEVBQUUsZUFBZTtRQUNyQixLQUFLLEVBQUUsQ0FBQztRQUNSLFFBQVEsRUFBRSxDQUFDO1FBQ1gsSUFBSSxFQUFFLFNBQVM7UUFDZixLQUFLLEVBQUUsQ0FBQztLQUNUO0lBRUQsU0FBUyxFQUFFO1FBQ1QsSUFBSSxFQUFFLFlBQVk7UUFDbEIsS0FBSyxFQUFFLEVBQUU7UUFDVCxRQUFRLEVBQUUsQ0FBQztRQUNYLElBQUksRUFBRSxTQUFTO1FBQ2YsS0FBSyxFQUFFLENBQUM7S0FDVDtJQUVELFVBQVUsRUFBRTtRQUNWLElBQUksRUFBRSx5Q0FBeUM7UUFDL0MsS0FBSyxFQUFFLEVBQUU7UUFDVCxRQUFRLEVBQUUsQ0FBQztRQUNYLElBQUksRUFBRSxTQUFTO1FBQ2YsS0FBSyxFQUFFLENBQUM7UUFDUixNQUFNLEVBQUUsSUFBSTtLQUNiO0lBRUQsV0FBVyxFQUFFO1FBQ1gsSUFBSSxFQUFFLDBDQUEwQztRQUNoRCxLQUFLLEVBQUUsRUFBRTtRQUNULFFBQVEsRUFBRSxDQUFDO1FBQ1gsSUFBSSxFQUFFLFNBQVM7UUFDZixLQUFLLEVBQUUsQ0FBQztRQUNSLE1BQU0sRUFBRSxJQUFJO0tBQ2I7SUFFRCxRQUFRLEVBQUU7UUFDUixJQUFJLEVBQUUsVUFBVTtRQUNoQixLQUFLLEVBQUUsRUFBRTtRQUNULFFBQVEsRUFBRSxDQUFDO1FBQ1gsSUFBSSxFQUFFLGNBQWM7UUFDcEIsS0FBSyxFQUFFLElBQUk7UUFDWCxLQUFLLEVBQUUsRUFBRTtLQUNWO0NBQ0YsQ0FBQyJ9