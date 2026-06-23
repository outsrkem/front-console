<template>
    <div class="svg-qrcode-wrap" ref="container" :style="{ margin: `${margin}px` }">
        <div class="svg-inner" v-html="svgHtml"></div>
        <div v-if="$slots.logo" class="qrcode-logo">
            <slot name="logo" />
        </div>
    </div>
</template>

<script>
import QRCodeSvg from "qrcode-svg";

export default {
    name: "SvgQrcode",
    props: {
        // QR code text content
        content: {
            type: String,
            required: true,
            default: "",
        },
        // Overall width & height of QR code
        size: {
            type: Number,
            default: 200,
        },
        // Inner padding inside QR code graphic (safe margin for scanning)
        padding: {
            type: Number,
            default: 0,
        },
        // Outer margin around the QR component for page layout
        margin: {
            type: Number,
            default: 0,
        },
        // Color of QR dark modules
        darkColor: {
            type: String,
            default: "#000000",
        },
        // Background color of QR code
        lightColor: {
            type: String,
            default: "#ffffff",
        },
        // Error correction level: L / M / Q / H
        ecl: {
            type: String,
            default: "M",
            validator: (val) => ["L", "M", "Q", "H"].includes(val),
        },
    },
    data() {
        return {
            svgHtml: "",
        };
    },
    watch: {
        content: { handler: "renderQr", immediate: true },
        size: "renderQr",
        padding: "renderQr",
        margin: "renderQr",
        darkColor: "renderQr",
        lightColor: "renderQr",
        ecl: "renderQr",
    },
    methods: {
        // Generate and clean QR svg source string
        renderQr() {
            if (!this.content) {
                this.svgHtml = "";
                return;
            }
            const qr = new QRCodeSvg({
                content: this.content,
                width: this.size,
                height: this.size,
                padding: this.padding,
                color: this.darkColor,
                background: this.lightColor,
                ecl: this.ecl,
                join: true,
            });
            let rawSvg = qr.svg();
            // Remove line breaks and blank spaces to eliminate bottom blank line
            rawSvg = rawSvg.trim().replace(/[\n\r]+/g, "");
            // Force override svg root width & height to avoid size overflow
            rawSvg = rawSvg.replace(/<svg([^>]+)width="[0-9.]+"/, `<svg$1width="${this.size}"`);
            rawSvg = rawSvg.replace(/height="[0-9.]+"/, `height="${this.size}"`);
            this.svgHtml = rawSvg;
        },
        // Download svg file locally
        downloadSvg() {
            if (!this.svgHtml) return;
            const blob = new Blob([this.svgHtml], { type: "image/svg+xml" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "qrcode.svg";
            a.click();
            URL.revokeObjectURL(url);
        },
    },
};
</script>

<style scoped>
.svg-qrcode-wrap {
    position: relative;
    display: inline-block;
    line-height: 0;
    overflow: hidden;
}
.svg-inner {
    line-height: 0;
}
.svg-inner svg {
    display: block;
    width: 100%;
    height: 100%;
}
.qrcode-logo {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 20%;
    height: 20%;
    overflow: hidden;
}
</style>
