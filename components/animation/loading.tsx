import { motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";

const SPINNER_SIZE = 50
//* just loading simple one
const LoadingSpinner = () => {
    return (
        <div className="h-1/2 w-full flex justify-center items-center">
            {/* Motion div for animation */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{repeat:Infinity, duration:1, ease: "linear"}}
                className="rounded-full">
                <LoaderCircle size={SPINNER_SIZE} />
        </motion.div>
        </div>
    )
}

export default LoadingSpinner