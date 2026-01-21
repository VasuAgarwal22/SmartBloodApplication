import React, { useState } from "react";
import { cn } from "../../utils/cn";
import Icon from '../AppIcon';

const Input = React.forwardRef(({
    className,
    type = "text",
    label,
    description,
    error,
    required = false,
    id,
    floating = false,
    isValid = null, // null: no validation, true: valid, false: invalid
    helperText,
    showPasswordToggle = false,
    ...props
}, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [capsLockOn, setCapsLockOn] = useState(false);

    // Generate unique ID if not provided
    const inputId = id || `input-${Math.random()?.toString(36)?.substr(2, 9)}`;

    // Base input classes
    const baseInputClasses = "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200";

    // Checkbox-specific styles
    if (type === "checkbox") {
        return (
            <input
                type="checkbox"
                className={cn(
                    "h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                id={inputId}
                {...props}
            />
        );
    }

    // Radio button-specific styles
    if (type === "radio") {
        return (
            <input
                type="radio"
                className={cn(
                    "h-4 w-4 rounded-full border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                id={inputId}
                {...props}
            />
        );
    }

    const handleFocus = (e) => {
        setIsFocused(true);
        props.onFocus?.(e);
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        props.onBlur?.(e);
    };

    const handleKeyDown = (e) => {
        if (type === "password") {
            setCapsLockOn(e.getModifierState("CapsLock"));
        }
        props.onKeyDown?.(e);
    };

    const inputType = showPasswordToggle && showPassword ? "text" : type;

    const hasValue = props.value && props.value.length > 0;
    const shouldFloat = floating && (isFocused || hasValue);

    // Validation classes
    let validationClasses = "";
    let validationIcon = null;
    if (isValid === true) {
        validationClasses = "border-green-500 focus-visible:ring-green-500";
        validationIcon = <Icon name="Check" size={16} className="absolute right-10 top-1/2 transform -translate-y-1/2 text-green-500" />;
    } else if (isValid === false) {
        validationClasses = "border-red-500 focus-visible:ring-red-500";
        validationIcon = <Icon name="X" size={16} className="absolute right-10 top-1/2 transform -translate-y-1/2 text-red-500" />;
    }

    // For regular inputs with wrapper structure
    return (
        <div className="space-y-2">
            {label && !floating && (
                <label
                    htmlFor={inputId}
                    className={cn(
                        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                        error ? "text-destructive" : "text-foreground"
                    )}
                >
                    {label}
                    {required && <span className="text-destructive ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                {floating && label && (
                    <label
                        htmlFor={inputId}
                        className={cn(
                            "absolute left-3 transition-all duration-200 pointer-events-none z-10",
                            shouldFloat
                                ? "top-2 text-xs text-primary bg-background px-1 -translate-y-0"
                                : "top-1/2 text-sm text-muted-foreground -translate-y-1/2",
                            error && "text-destructive",
                            isValid === true && "text-green-600",
                            isValid === false && "text-red-600"
                        )}
                    >
                        {label}
                        {required && <span className="text-destructive ml-1">*</span>}
                    </label>
                )}

                <input
                    type={inputType}
                    className={cn(
                        baseInputClasses,
                        error && "border-destructive focus-visible:ring-destructive",
                        validationClasses,
                        floating && "pt-6 pb-2",
                        showPasswordToggle && "pr-10",
                        className
                    )}
                    ref={ref}
                    id={inputId}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    {...props}
                />

                {validationIcon}

                {showPasswordToggle && (
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                    >
                        <Icon name={showPassword ? "EyeOff" : "Eye"} size={16} />
                    </button>
                )}
            </div>

            {capsLockOn && type === "password" && (
                <p className="text-sm text-yellow-600 flex items-center">
                    <Icon name="AlertTriangle" size={14} className="mr-1" />
                    Caps Lock is on
                </p>
            )}

            {helperText && isFocused && !error && (
                <p className="text-sm text-muted-foreground transition-opacity duration-200">
                    {helperText}
                </p>
            )}

            {description && !error && !isFocused && (
                <p className="text-sm text-muted-foreground">
                    {description}
                </p>
            )}

            {error && (
                <p className="text-sm text-destructive">
                    {error}
                </p>
            )}
        </div>
    );
});

Input.displayName = "Input";

export default Input;