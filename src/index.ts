import { ValidationRule } from 'antd/lib/form';
import { FormRuleType } from './FormRuleType';

export { FormRuleType } from './FormRuleType';

export class FormRules {
    private readonly name: string;

    private rules: ValidationRule[] = [];

    constructor(name: string) {
        this.name = name;
    }

    public static withName(fieldLocalName: string): FormRules {
        return new FormRules(fieldLocalName);
    }

    private static formatMessageByLimit(min?: number, max?: number, type: string = '', unit: string = ''): string {
        const existMin = typeof min === 'number';
        const existMax = typeof max === 'number';
        let message: string;

        if (existMax && existMin) {
            message = `:name必须是${type}，且${unit}在:min到:max之间`;
        } else if (existMax) {
            message = `:name必须是${type}，且${unit}小于等于:max`;
        } else if (existMin) {
            message = `:name是必须是${type}，且${unit}大于等于:min`;
        } else {
            message = `:name必须是${type}`;
        }

        if (existMin) {
            message = message.replace(':min', String(min));
        }

        if (existMax) {
            message = message.replace(':max', String(max));
        }

        return message;
    }

    // 验证时转换数字类型（但是并不影响最终值）
    private static transformNumber(value?: string | number): number | undefined {
        if (typeof value === 'number') {
            return value;
        }

        return typeof value === 'string' && value.length ? Number(value) : void 0;
    }

    public isRequired(onlyWhiteSpaceIsError = true): FormRules {
        let lastRule = this.rules[this.rules.length - 1];

        if (!lastRule) {
            this.string();
            lastRule = this.rules[this.rules.length - 1];
        }

        lastRule.required = true;
        lastRule.whitespace = onlyWhiteSpaceIsError;

        return this;
    }

    public append(obj: ValidationRule): FormRules {
        const cloneObj = { ...obj };

        if (typeof cloneObj.message === 'string') {
            cloneObj.message = cloneObj.message.replace(':name', this.name);
        }

        this.rules.push(cloneObj);

        return this;
    }

    public string(min?: number, max?: number, message: string = ''): FormRules {
        message = message || FormRules.formatMessageByLimit(min, max, '字符串', '长度');

        this.rules.push({
            type: FormRuleType.string,
            min,
            max,
            message: message.replace(':name', this.name),
        });

        return this;
    }

    public bool(message: string = ':name必须是布尔值'): FormRules {
        this.rules.push({
            type: FormRuleType.boolean,
            message: message.replace(':name', this.name),
        });

        return this;
    }

    public array(message: string = ':name必须是数组'): FormRules {
        this.rules.push({
            type: FormRuleType.array,
            message: message.replace(':name', this.name),
        });

        return this;
    }

    public phone(message = '请输入正确的:name'): FormRules {
        this.rules.push({
            type: FormRuleType.string,
            pattern: /^1[3-9]\d{9}$/u,
            message: message.replace(':name', this.name),
        });

        return this;
    }

    public number(min?: number, max?: number, message: string = ''): FormRules {
        message = message || FormRules.formatMessageByLimit(min, max, '数字', '值');

        this.rules.push({
            type: FormRuleType.number,
            transform: FormRules.transformNumber,
            min,
            max,
            message: message.replace(':name', this.name),
        });

        return this;
    }

    public integer(min?: number, max?: number, message = ''): FormRules {
        message = message || FormRules.formatMessageByLimit(min, max, '整数', '值');

        this.rules.push({
            type: FormRuleType.integer,
            transform: FormRules.transformNumber,
            min,
            max,
            message: message.replace(':name', this.name),
        });

        return this;
    }

    public email(message = ':name必须是个邮箱号'): FormRules {
        this.rules.push({
            type: FormRuleType.email,
            message: message.replace(':name', this.name),
        });

        return this;
    }

    public match(pattern: RegExp, message = ':name不符合匹配标准'): FormRules {
        this.rules.push({
            type: FormRuleType.string,
            pattern,
            message: message.replace(':name', this.name),
        });

        return this;
    }

    public url(message = ':name不符合url规则'): FormRules {
        this.rules.push({
            type: FormRuleType.url,
            message: message.replace(':name', this.name),
        });

        return this;
    }

    public callback<T extends Error>(func: (value: any, field: string) => T | T[] | void): FormRules {
        this.rules.push({
            validator: (rule, value, callback) => {
                const errors: T | T[] | void = func(value, rule.field);

                callback(Array.isArray(errors) ? errors : [errors]);
            },
        });

        return this;
    }

    public identityCard(message = ':name不是有效的身份证'): FormRules {
        return this.match(/^(\d{18}|\d{17}[xX])$/, message);
    }

    public resetRule(): FormRules {
        this.rules = [];

        return this;
    }

    public create(): ValidationRule[] {
        return this.rules;
    }
}
