const StatCard = ({
    title,
    value,
    description
}) => {

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

            <p className="text-sm text-slate-400">
                {title}
            </p>

            <p className="text-3xl font-bold text-white mt-2">
                {value}
            </p>

            {description && (
                <p className="text-xs text-slate-500 mt-2">
                    {description}
                </p>
            )}

        </div>
    );
};

export default StatCard;