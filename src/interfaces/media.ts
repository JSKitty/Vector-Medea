import { ResultMessage, ResultMessagev2 } from "./server.js";
import { Request } from "express";

interface legacyMediaReturnMessage extends ResultMessage {
	status: string;
	id: string;
	pubkey: string;
	url: string;
	hash: string;
	magnet: string;
	tags: Array<string>;
}

interface mediaInfoReturnMessage extends ResultMessagev2 {
	satoshi: number;
}

const UploadTypes = ["avatar", "banner", "media"];
const UploadStatus = ["pending", "processing", "completed", "failed"];
const MediaStatus = ["success", "error", "processing"];

interface MediaTypeInfo {
    originalMime: string;
    extension: string;
    convertedMime: string;
	convertedExtension?: string;
}

const mediaTypes: MediaTypeInfo[] = [
    // Images
    { originalMime: "image/png", extension: "png", convertedMime: "image/webp", convertedExtension: "webp" },
    { originalMime: "image/jpg", extension: "jpg", convertedMime: "image/webp" , convertedExtension: "webp" },
    { originalMime: "image/jpeg", extension: "jpeg", convertedMime: "image/webp" , convertedExtension: "webp" },
    { originalMime: "image/gif", extension: "gif", convertedMime: "image/webp" , convertedExtension: "webp" },
    { originalMime: "image/webp", extension: "webp", convertedMime: "image/webp" , convertedExtension: "webp" },
    { originalMime: "image/svg+xml", extension: "svg", convertedMime: "image/svg+xml" },
    { originalMime: "image/bmp", extension: "bmp", convertedMime: "image/webp", convertedExtension: "webp" },
    { originalMime: "image/x-ms-bmp", extension: "bmp", convertedMime: "image/webp", convertedExtension: "webp" },
    { originalMime: "image/tiff", extension: "tiff", convertedMime: "image/webp", convertedExtension: "webp" },
    { originalMime: "image/tiff", extension: "tif", convertedMime: "image/webp", convertedExtension: "webp" },
    { originalMime: "image/x-icon", extension: "ico", convertedMime: "image/x-icon" },
    { originalMime: "image/vnd.microsoft.icon", extension: "ico", convertedMime: "image/x-icon" },
    { originalMime: "image/avif", extension: "avif", convertedMime: "image/avif" },
    { originalMime: "image/heic", extension: "heic", convertedMime: "image/webp", convertedExtension: "webp" },
    { originalMime: "image/heif", extension: "heif", convertedMime: "image/webp", convertedExtension: "webp" },
    { originalMime: "image/jxl", extension: "jxl", convertedMime: "image/webp", convertedExtension: "webp" },
    { originalMime: "image/apng", extension: "apng", convertedMime: "image/apng" },

    // Videos
    { originalMime: "video/mp4", extension: "mp4", convertedMime: "video/mp4" , convertedExtension: "mp4" },
    { originalMime: "video/quicktime", extension: "mov", convertedMime: "video/mp4" , convertedExtension: "mp4" },
    { originalMime: "video/mpeg", extension: "mpeg", convertedMime: "video/mp4" , convertedExtension: "mp4" },
    { originalMime: "video/webm", extension: "webm", convertedMime: "video/mp4" , convertedExtension: "mp4" },
    { originalMime: "video/x-msvideo", extension: "avi", convertedMime: "video/mp4", convertedExtension: "mp4" },
    { originalMime: "video/x-matroska", extension: "mkv", convertedMime: "video/mp4", convertedExtension: "mp4" },
    { originalMime: "video/x-flv", extension: "flv", convertedMime: "video/mp4", convertedExtension: "mp4" },
    { originalMime: "video/x-ms-wmv", extension: "wmv", convertedMime: "video/mp4", convertedExtension: "mp4" },
    { originalMime: "video/3gpp", extension: "3gp", convertedMime: "video/mp4", convertedExtension: "mp4" },
    { originalMime: "video/3gpp2", extension: "3g2", convertedMime: "video/mp4", convertedExtension: "mp4" },
    { originalMime: "video/ogg", extension: "ogv", convertedMime: "video/mp4", convertedExtension: "mp4" },
    { originalMime: "video/x-m4v", extension: "m4v", convertedMime: "video/mp4", convertedExtension: "mp4" },
    { originalMime: "video/mp2t", extension: "ts", convertedMime: "video/mp4", convertedExtension: "mp4" },
    { originalMime: "video/x-f4v", extension: "f4v", convertedMime: "video/mp4", convertedExtension: "mp4" },

    // Audio
    { originalMime: "audio/mpeg", extension: "mp3", convertedMime: "audio/mpeg"},
    { originalMime: "audio/mpg", extension: "mp3", convertedMime: "audio/mpeg" },
    { originalMime: "audio/mpeg3", extension: "mp3", convertedMime: "audio/mpeg"},
    { originalMime: "audio/mp3", extension: "mp3", convertedMime: "audio/mpeg" },
    { originalMime: "audio/wav", extension: "wav", convertedMime: "audio/wav" },
    { originalMime: "audio/x-wav", extension: "wav", convertedMime: "audio/wav" },
    { originalMime: "audio/wave", extension: "wav", convertedMime: "audio/wav" },
    { originalMime: "audio/mp4", extension: "m4a", convertedMime: "audio/mp4" },
    { originalMime: "audio/x-m4a", extension: "m4a", convertedMime: "audio/mp4" },
    { originalMime: "audio/m4a", extension: "m4a", convertedMime: "audio/mp4" },
    { originalMime: "audio/ogg", extension: "ogg", convertedMime: "audio/ogg" },
    { originalMime: "audio/vorbis", extension: "ogg", convertedMime: "audio/ogg" },
    { originalMime: "application/ogg", extension: "ogg", convertedMime: "audio/ogg" },
    { originalMime: "audio/flac", extension: "flac", convertedMime: "audio/flac" },
    { originalMime: "audio/x-flac", extension: "flac", convertedMime: "audio/flac" },
    { originalMime: "audio/aac", extension: "aac", convertedMime: "audio/aac" },
    { originalMime: "audio/aacp", extension: "aac", convertedMime: "audio/aac" },
    { originalMime: "audio/x-aac", extension: "aac", convertedMime: "audio/aac" },
    { originalMime: "audio/opus", extension: "opus", convertedMime: "audio/opus" },
    { originalMime: "audio/webm", extension: "weba", convertedMime: "audio/webm" },
    { originalMime: "audio/x-ms-wma", extension: "wma", convertedMime: "audio/mpeg" },
    { originalMime: "audio/midi", extension: "mid", convertedMime: "audio/midi" },
    { originalMime: "audio/midi", extension: "midi", convertedMime: "audio/midi" },
    { originalMime: "audio/x-aiff", extension: "aiff", convertedMime: "audio/x-aiff" },
    { originalMime: "audio/x-aiff", extension: "aif", convertedMime: "audio/x-aiff" },
    { originalMime: "audio/amr", extension: "amr", convertedMime: "audio/amr" },
    { originalMime: "audio/3gpp", extension: "3gp", convertedMime: "audio/3gpp" },
    { originalMime: "audio/3gpp2", extension: "3g2", convertedMime: "audio/3gpp2" },

    // Documents
    { originalMime: "application/pdf", extension: "pdf", convertedMime: "application/pdf" },
    { originalMime: "application/msword", extension: "doc", convertedMime: "application/msword" },
    { originalMime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", extension: "docx", convertedMime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
    { originalMime: "application/vnd.ms-excel", extension: "xls", convertedMime: "application/vnd.ms-excel" },
    { originalMime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", extension: "xlsx", convertedMime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
    { originalMime: "application/vnd.ms-powerpoint", extension: "ppt", convertedMime: "application/vnd.ms-powerpoint" },
    { originalMime: "application/vnd.openxmlformats-officedocument.presentationml.presentation", extension: "pptx", convertedMime: "application/vnd.openxmlformats-officedocument.presentationml.presentation" },
    { originalMime: "application/vnd.oasis.opendocument.text", extension: "odt", convertedMime: "application/vnd.oasis.opendocument.text" },
    { originalMime: "application/vnd.oasis.opendocument.spreadsheet", extension: "ods", convertedMime: "application/vnd.oasis.opendocument.spreadsheet" },
    { originalMime: "application/vnd.oasis.opendocument.presentation", extension: "odp", convertedMime: "application/vnd.oasis.opendocument.presentation" },
    { originalMime: "application/rtf", extension: "rtf", convertedMime: "application/rtf" },
    { originalMime: "text/rtf", extension: "rtf", convertedMime: "text/rtf" },
    { originalMime: "application/epub+zip", extension: "epub", convertedMime: "application/epub+zip" },

    // Archives
    { originalMime: "application/zip", extension: "zip", convertedMime: "application/zip" },
    { originalMime: "application/x-zip-compressed", extension: "zip", convertedMime: "application/zip" },
    { originalMime: "application/x-rar-compressed", extension: "rar", convertedMime: "application/x-rar-compressed" },
    { originalMime: "application/vnd.rar", extension: "rar", convertedMime: "application/vnd.rar" },
    { originalMime: "application/x-7z-compressed", extension: "7z", convertedMime: "application/x-7z-compressed" },
    { originalMime: "application/x-tar", extension: "tar", convertedMime: "application/x-tar" },
    { originalMime: "application/gzip", extension: "gz", convertedMime: "application/gzip" },
    { originalMime: "application/x-gzip", extension: "gz", convertedMime: "application/gzip" },
    { originalMime: "application/x-bzip", extension: "bz", convertedMime: "application/x-bzip" },
    { originalMime: "application/x-bzip2", extension: "bz2", convertedMime: "application/x-bzip2" },
    { originalMime: "application/x-xz", extension: "xz", convertedMime: "application/x-xz" },

    // Code & Development
    { originalMime: "application/javascript", extension: "js", convertedMime: "application/javascript" },
    { originalMime: "text/javascript", extension: "js", convertedMime: "text/javascript" },
    { originalMime: "application/x-javascript", extension: "js", convertedMime: "application/javascript" },
    { originalMime: "application/json", extension: "json", convertedMime: "application/json" },
    { originalMime: "application/typescript", extension: "ts", convertedMime: "application/typescript" },
    { originalMime: "text/typescript", extension: "ts", convertedMime: "text/typescript" },
    { originalMime: "application/x-typescript", extension: "tsx", convertedMime: "application/x-typescript" },
    { originalMime: "text/x-python", extension: "py", convertedMime: "text/x-python" },
    { originalMime: "text/x-java-source", extension: "java", convertedMime: "text/x-java-source" },
    { originalMime: "text/x-c", extension: "c", convertedMime: "text/x-c" },
    { originalMime: "text/x-c++", extension: "cpp", convertedMime: "text/x-c++" },
    { originalMime: "text/x-csharp", extension: "cs", convertedMime: "text/x-csharp" },
    { originalMime: "text/x-ruby", extension: "rb", convertedMime: "text/x-ruby" },
    { originalMime: "text/x-go", extension: "go", convertedMime: "text/x-go" },
    { originalMime: "text/x-rust", extension: "rs", convertedMime: "text/x-rust" },
    { originalMime: "text/x-php", extension: "php", convertedMime: "text/x-php" },
    { originalMime: "application/x-httpd-php", extension: "php", convertedMime: "application/x-httpd-php" },
    { originalMime: "text/x-swift", extension: "swift", convertedMime: "text/x-swift" },
    { originalMime: "text/x-kotlin", extension: "kt", convertedMime: "text/x-kotlin" },
    { originalMime: "text/x-scala", extension: "scala", convertedMime: "text/x-scala" },
    { originalMime: "text/x-sh", extension: "sh", convertedMime: "text/x-sh" },
    { originalMime: "application/x-sh", extension: "sh", convertedMime: "application/x-sh" },
    { originalMime: "text/x-shellscript", extension: "sh", convertedMime: "text/x-shellscript" },
    { originalMime: "application/x-powershell", extension: "ps1", convertedMime: "application/x-powershell" },
    { originalMime: "text/x-lua", extension: "lua", convertedMime: "text/x-lua" },
    { originalMime: "text/x-perl", extension: "pl", convertedMime: "text/x-perl" },
    { originalMime: "application/x-perl", extension: "pl", convertedMime: "application/x-perl" },

    // Markup & Web
    { originalMime: "text/html", extension: "html", convertedMime: "text/html" },
    { originalMime: "text/html", extension: "htm", convertedMime: "text/html" },
    { originalMime: "application/xhtml+xml", extension: "xhtml", convertedMime: "application/xhtml+xml" },
    { originalMime: "text/css", extension: "css", convertedMime: "text/css" },
    { originalMime: "text/scss", extension: "scss", convertedMime: "text/scss" },
    { originalMime: "text/sass", extension: "sass", convertedMime: "text/sass" },
    { originalMime: "text/less", extension: "less", convertedMime: "text/less" },
    { originalMime: "application/xml", extension: "xml", convertedMime: "application/xml" },
    { originalMime: "text/xml", extension: "xml", convertedMime: "text/xml" },
    { originalMime: "application/yaml", extension: "yaml", convertedMime: "application/yaml" },
    { originalMime: "text/yaml", extension: "yaml", convertedMime: "text/yaml" },
    { originalMime: "application/yaml", extension: "yml", convertedMime: "application/yaml" },
    { originalMime: "text/yaml", extension: "yml", convertedMime: "text/yaml" },
    { originalMime: "text/markdown", extension: "md", convertedMime: "text/markdown" },
    { originalMime: "text/x-markdown", extension: "md", convertedMime: "text/markdown" },
    { originalMime: "text/plain", extension: "txt", convertedMime: "text/plain" },
    { originalMime: "text/csv", extension: "csv", convertedMime: "text/csv" },
    { originalMime: "text/tab-separated-values", extension: "tsv", convertedMime: "text/tab-separated-values" },
    { originalMime: "text/x-handlebars-template", extension: "hbs", convertedMime: "text/x-handlebars-template" },
    { originalMime: "text/x-vue", extension: "vue", convertedMime: "text/x-vue" },
    { originalMime: "application/toml", extension: "toml", convertedMime: "application/toml" },
    { originalMime: "text/x-ini", extension: "ini", convertedMime: "text/x-ini" },
    { originalMime: "text/x-properties", extension: "properties", convertedMime: "text/x-properties" },

    // Fonts
    { originalMime: "font/otf", extension: "otf", convertedMime: "font/otf" },
    { originalMime: "font/ttf", extension: "ttf", convertedMime: "font/ttf" },
    { originalMime: "font/woff", extension: "woff", convertedMime: "font/woff" },
    { originalMime: "font/woff2", extension: "woff2", convertedMime: "font/woff2" },
    { originalMime: "application/vnd.ms-fontobject", extension: "eot", convertedMime: "application/vnd.ms-fontobject" },
    { originalMime: "application/font-sfnt", extension: "ttf", convertedMime: "font/ttf" },

    // 3D Models
    { originalMime: "model/stl", extension: "stl", convertedMime: "model/stl" },
    { originalMime: "application/sla", extension: "stl", convertedMime: "model/stl" },
    { originalMime: "model/gltf+json", extension: "gltf", convertedMime: "model/gltf+json" },
    { originalMime: "model/gltf-binary", extension: "glb", convertedMime: "model/gltf-binary" },
    { originalMime: "model/obj", extension: "obj", convertedMime: "model/obj" },
    { originalMime: "text/plain", extension: "obj", convertedMime: "model/obj" },
    { originalMime: "model/vnd.collada+xml", extension: "dae", convertedMime: "model/vnd.collada+xml" },
    { originalMime: "model/3mf", extension: "3mf", convertedMime: "model/3mf" },
    { originalMime: "application/vnd.ms-pki.stl", extension: "stl", convertedMime: "model/stl" },

    // Data
    { originalMime: "application/x-sqlite3", extension: "sqlite", convertedMime: "application/x-sqlite3" },
    { originalMime: "application/x-sqlite3", extension: "sqlite3", convertedMime: "application/x-sqlite3" },
    { originalMime: "application/x-sqlite3", extension: "db", convertedMime: "application/x-sqlite3" },
    { originalMime: "application/vnd.api+json", extension: "json", convertedMime: "application/vnd.api+json" },
    { originalMime: "application/ld+json", extension: "jsonld", convertedMime: "application/ld+json" },
    { originalMime: "application/x-ndjson", extension: "ndjson", convertedMime: "application/x-ndjson" },

    // Misc
    { originalMime: "application/octet-stream", extension: "bin", convertedMime: "application/octet-stream" },
    { originalMime: "application/x-executable", extension: "exe", convertedMime: "application/x-executable" },
    { originalMime: "application/x-msdownload", extension: "exe", convertedMime: "application/x-msdownload" },
    { originalMime: "application/x-msdos-program", extension: "exe", convertedMime: "application/x-msdos-program" },
    { originalMime: "application/x-apple-diskimage", extension: "dmg", convertedMime: "application/x-apple-diskimage" },
    { originalMime: "application/vnd.android.package-archive", extension: "apk", convertedMime: "application/vnd.android.package-archive" },
    { originalMime: "application/x-debian-package", extension: "deb", convertedMime: "application/x-debian-package" },
    { originalMime: "application/x-rpm", extension: "rpm", convertedMime: "application/x-rpm" },
    { originalMime: "application/x-msi", extension: "msi", convertedMime: "application/x-msi" },
    { originalMime: "application/pgp-encrypted", extension: "pgp", convertedMime: "application/pgp-encrypted" },
    { originalMime: "application/pgp-signature", extension: "sig", convertedMime: "application/pgp-signature" },
    { originalMime: "application/x-iso9660-image", extension: "iso", convertedMime: "application/x-iso9660-image" },
    { originalMime: "application/wasm", extension: "wasm", convertedMime: "application/wasm" },
    { originalMime: "text/calendar", extension: "ics", convertedMime: "text/calendar" },
    { originalMime: "text/vcard", extension: "vcf", convertedMime: "text/vcard" },
    { originalMime: "application/x-bittorrent", extension: "torrent", convertedMime: "application/x-bittorrent" }
];

interface fileData{
	filename: string;
	width: number;
	height: number;
	fileid: string;
	filesize: number;
	pubkey: string;
	originalhash: string;
	hash: string;
	blurhash: string;
	url: string;
	magnet: string;
	torrent_infohash: string;
	date: number;
	servername: string;
	no_transform: boolean;
	media_type: typeof UploadTypes[number];
	originalmime: string;
	outputoptions: string;
	status: string;
	description: string;
	processing_url: string;
	conversionInputPath: string;
	conversionOutputPath: string;
	newFileDimensions: string;
	transaction_id: string;
	payment_request: string;
	visibility: number;

}

interface asyncTask {
	req: Request;
	filedata: fileData;
}

interface videoHeaderRange {
	Start: number;
	End: number;
}

export {
	asyncTask,
	fileData,
	legacyMediaReturnMessage,
	mediaInfoReturnMessage,
	mediaTypes,
	ResultMessage,
	UploadTypes,
	UploadStatus,
	MediaStatus,
	videoHeaderRange
};