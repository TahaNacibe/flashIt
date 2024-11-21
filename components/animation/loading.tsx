import { motion } from "framer-motion";

const LoadingSpinner = () => {
    return (
        <div className="h-1/2 w-full flex justify-center items-center">
            {/* Motion div for animation */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{repeat:Infinity, duration:1, ease: "linear"}}
                className="w-16 h-16 border-8 border-t-transparent border-blue-500 border-solid rounded-full">
        </motion.div>
        </div>
    )
}

export default LoadingSpinner