# AiToEarn MCP [中文文档](开发文档.md)

A Model Context Protocol (MCP) server that provides social media publishing and account management capabilities for AI-driven content creation and automation.

## 🚀 Features

- **Account Management**: Retrieve and manage social media accounts
- **Content Publishing**: Publish video and article content to social media platforms
- **Batch Operations**: Publish content to multiple accounts simultaneously
- **Type Validation**: Automatic validation based on content type requirements
- **Error Handling**: Comprehensive error handling with detailed feedback

## 📋 Requirements

- Node.js >= 18.0.0
- npm or yarn
- AiToEarn API access with valid API key

## 🛠️ Installation

### Via npm (Recommended)

```bash
npm install aitoearn-mcp
```

### Via GitHub

1. Clone the repository:
```bash
git clone https://github.com/aitoearn/aitoearn-mcp-server.git
cd aitoearn-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## 🔧 Usage

### Using as a Global CLI Tool

After installing globally:
```bash
npm install -g aitoearn-mcp
aitoearn-mcp
```

### Using as a Local Package

After installing locally:
```bash
npm install aitoearn-mcp
npx aitoearn-mcp
```

### Programmatic Usage

```javascript
import { spawn } from 'child_process';

// Start the MCP server as a subprocess
const server = spawn('npx', ['aitoearn-mcp']);

server.stdout.on('data', (data) => {
  console.log(`Server: ${data}`);
});
```

### Running the MCP Server

```bash
npm start
```

### Available Tools

#### 1. get-skKey
Open Aitoearn platform website for account management and platform access.

#### 2. create-publish-list
Batch publish content to all accounts associated with your API key.

**Parameters:**
- `skKey` (string): Your AiToEarn API key
- `type` (string): Content type ("video" or "article")
- `title` (string): Content title
- `coverUrl` (string): Cover image URL
- `topics` (string): Comma-separated topics/hashtags
- `desc` (string, optional): Content description
- `videoUrl` (string): Video URL (required for video type)
- `imgUrlList` (string): Comma-separated image URLs (required for article type)
- `publishTime` (string, optional): Scheduled publish time

**Example (Video):**
```json
{
  "skKey": "sk-YOUR_API_KEY_HERE",
  "type": "video",
  "title": "My Amazing Video",
  "videoUrl": "https://example.com/video.mp4",
  "coverUrl": "https://example.com/cover.jpg",
  "topics": "lifestyle,entertainment"
}
```

**Example (Article):**
```json
{
  "skKey": "sk-YOUR_API_KEY_HERE",
  "type": "article",
  "title": "My Article Title",
  "imgUrlList": "https://example.com/img1.jpg,https://example.com/img2.jpg",
  "coverUrl": "https://example.com/cover.jpg",
  "topics": "technology,innovation"
}
```

#### 3. get-publish-task-list
Get the list of published tasks

**参数：**
- `skKey` (string): Your AiToEarn API key
- `flowId` (string): The flow ID returned during batch release

**示例**
```json
{
  "skKey": "sk-YOUR_API_KEY_HERE",
  "flowId": "flowId",
}
```

### MCP Client Configuration

#### Claude Desktop

Add the server configuration to your Claude Desktop config file:

**macOS/Linux:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "aitoearn": {
      "command": "npx",
      "args": ["aitoearn-mcp"]
    }
  }
}
```

Or if installed globally:

```json
{
  "mcpServers": {
    "aitoearn": {
      "command": "aitoearn-mcp"
    }
  }
}
```

#### Other MCP Clients

For other MCP clients, refer to their documentation on how to configure MCP servers. The server runs over stdio transport.

**Description:**
This tool provides information about the AiToEarn platform (https://aitoearn.ai) including:
- Account management and configuration
- Content creation and scheduling
- Analytics and performance tracking
- API key management
- Social media account integration

## 🏗️ Content Type Requirements

### Video Content (`type: "video"`)
- **Required**: `videoUrl` - Video file URL
- **Optional**: `imgUrlList` - Additional images

### Article Content (`type: "article"`)
- **Required**: `imgUrlList` - Comma-separated list of image URLs
- **Optional**: `videoUrl` - Additional video content

## 🔍 Error Handling

The server provides comprehensive error handling with detailed error messages:

- **Validation Errors**: Clear messages about missing required fields
- **API Errors**: Detailed information about API communication issues
- **Network Errors**: Helpful guidance for connectivity problems
- **Authentication Errors**: Clear feedback about API key issues

## 🧪 Development

### Build
```bash
npm run build
```

### Development Mode
```bash
npm run dev
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Links

- [ModelScope MCP Documentation](https://modelscope.cn/docs/mcp/create)
- [Model Context Protocol Specification](https://spec.modelcontextprotocol.io/)
- [AiToEarn Platform](https://aitoearn.ai)