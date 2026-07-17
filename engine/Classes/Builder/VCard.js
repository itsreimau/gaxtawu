const { generate } = require("vcard-parser");

class VCardBuilder {
    constructor(opts = {}) {
        this.fullName = opts.fullName || null;
        this.org = opts.org || null;
        this.number = opts.number || null;
    }

    setFullName(fullName) {
        if (!fullName) throw new Error("Full name is required.");
        this.fullName = fullName;
        return this;
    }

    setOrg(org) {
        if (!org) throw new Error("Organization name is required.");
        this.org = org;
        return this;
    }

    setNumber(number) {
        if (!number) throw new Error("Number is required.");
        this.number = number;
        return this;
    }

    build() {
        const cleanNumber = this.number.replace(/\s/g, "");
        return generate({
            version: [{
                value: "3.0"
            }],
            fn: [{
                value: this.fullName
            }],
            org: [{
                value: [this.org]
            }],
            tel: [{
                value: `+${cleanNumber}`,
                meta: {
                    type: ["CELL", "VOICE"],
                    waid: [cleanNumber]
                }
            }]
        });
    }
}

module.exports = VCardBuilder;