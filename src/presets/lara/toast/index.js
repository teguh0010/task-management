export default {
    root: ({ props }) => ({
        class: [
            //Size and Shape
            'w-66 rounded-full',
            'text-center',

            // Positioning
            'w-full max-w-xs mx-auto', // Adjusted for full width and centering
        ]
    }),
    container: ({ props }) => ({
        class: [
            'my-3 rounded-full w-full',
            'border-solid border-0',
            'shadow-sm',

            // Adjusted Colors for solid background
            {
                'bg-blue-100 dark:bg-blue-500': props.message.severity == 'info',
                'bg-green-500 dark:bg-green-400': props.message.severity == 'success', // Solid green background
                'bg-orange-100 dark:bg-orange-500': props.message.severity == 'warn',
                'bg-red-100 dark:bg-red-500': props.message.severity == 'error'
            },
            {
                'border-blue-500 dark:border-blue-400': props.message.severity == 'info',
                'border-green-500 dark:border-green-400': props.message.severity == 'success',
                'border-orange-500 dark:border-orange-400': props.message.severity == 'warn',
                'border-red-500 dark:border-red-400': props.message.severity == 'error'
            },
            // Adjusted text color to white for success
            {
                'text-blue-700 dark:text-blue-300': props.message.severity == 'info',
                'text-white': props.message.severity == 'success', // White text for success
                'text-orange-700 dark:text-orange-300': props.message.severity == 'warn',
                'text-red-700 dark:text-red-300': props.message.severity == 'error'
            }
        ]
    }),
    content: {
        class: 'flex items-start p-2'
    },
    icon: {
        class: [
            // Sizing and Spacing
            'w-5 h-5',
            'text-lg leading-none mr-2 mt-2 shrink-0'
        ]
    },
    text: {
        class: [
            // Font and Text
            'text-base leading-none',
            'ml-2',
            'flex-1'
        ]
    },
    summary: {
        class: 'font-bold block'
    },
    detail: {
        class: 'mt-2 block'
    },
    closebutton: {
        class: [
            // Flexbox
            'flex items-center justify-center',

            // Size
            'w-8 h-8',

            // Spacing and Misc
            'ml-auto  relative',

            // Shape
            'rounded-full',

            // Colors
            'bg-transparent',

            // Transitions
            'transition duration-200 ease-in-out',

            // States
            'hover:bg-surface-0/50 dark:hover:bg-surface-0/10',

            // Misc
            'overflow-hidden'
        ]
    },
    transition: {
        enterFromClass: 'opacity-0 translate-y-2/4',
        enterActiveClass: 'transition-[transform,opacity] duration-300',
        leaveFromClass: 'max-h-[1000px]',
        leaveActiveClass: '!transition-[max-height_.45s_cubic-bezier(0,1,0,1),opacity_.3s,margin-bottom_.3s] overflow-hidden',
        leaveToClass: 'max-h-0 opacity-0 mb-0'
    }
};
