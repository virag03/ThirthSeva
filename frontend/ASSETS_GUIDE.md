# TirthSeva Assets Guide

## 📁 Assets Folder Structure

```
frontend/
  └── public/
      └── assets/
          └── images/
              ├── temples/       (Temple images)
              ├── bhaktnivas/    (Accommodation photos)
              ├── icons/         (Custom icons)
              └── general/       (General images)
```

## 🖼️ How to Use Images

### 1. **Add Your Images**

Place your images in the appropriate folder:
- Temple photos → `/public/assets/images/temples/`
- Bhaktnivas photos → `/public/assets/images/bhaktnivas/`
- Icons → `/public/assets/images/icons/`
- Other images → `/public/assets/images/general/`

### 2. **Reference Images in Code**

Since images are in the `public` folder, reference them from the root:

```jsx
// Example 1: Temple image
<img src="/assets/images/temples/tirupati.jpg" alt="Tirupati Temple" />

// Example 2: Bhaktnivas image
<img src="/assets/images/bhaktnivas/laxmi-nivas.jpg" alt="Laxmi Nivas" />

// Example 3: Logo/Icon
<img src="/assets/images/icons/om-symbol.png" alt="Om Symbol" />

// Example 4: With styling
<img 
  src="/assets/images/temples/golden-temple.jpg" 
  alt="Golden Temple"
  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
/>
```

### 3. **Using in Components**

**TempleCard.jsx:**
```jsx
<img
  src={temple.imageUrl || '/assets/images/temples/default-temple.jpg'}
  alt={temple.name}
  style={{ height: '200px', objectFit: 'cover' }}
/>
```

**BhaktnivasCard.jsx:**
```jsx
<img
  src={bhaktnivas.imageUrl || '/assets/images/bhaktnivas/default-room.jpg'}
  alt={bhaktnivas.name}
  style={{ height: '180px', objectFit: 'cover' }}
/>
```

### 4. **Background Images in CSS**

```css
.hero-section {
  background-image: url('/assets/images/general/hero-bg.jpg');
  background-size: cover;
  background-position: center;
}
```

## 📋 Image Guidelines

### Recommended Sizes:
- **Temple cards**: 400x300px (4:3 ratio)
- **Bhaktnivas cards**: 360x240px (3:2 ratio)
- **Hero images**: 1920x600px (panoramic)
- **Icons**: 64x64px or 128x128px (square)
- **Logo**: 200x200px (square)

### File Format:
- Photos: `.jpg` or `.webp` (for smaller file size)
- Icons/Graphics: `.png` (for transparency)
- Logos: `.svg` (for scalability)

### File Naming:
- Use lowercase
- Use hyphens instead of spaces
- Be descriptive: `golden-temple.jpg` ✅ not `img1.jpg` ❌

## 💡 Example: Adding Temple Images

1. **Save your temple image:**
   - File: `tirupati-balaji.jpg`
   - Location: `/public/assets/images/temples/tirupati-balaji.jpg`

2. **Update database seed (if needed):**
   ```csharp
   ImageUrl = "/assets/images/temples/tirupati-balaji.jpg"
   ```

3. **Or use directly in component:**
   ```jsx
   <img src="/assets/images/temples/tirupati-balaji.jpg" alt="Tirupati Balaji" />
   ```

## 🎯 Quick Reference Paths

| Image Type | Path |
|------------|------|
| Temple | `/assets/images/temples/your-image.jpg` |
| Bhaktnivas | `/assets/images/bhaktnivas/your-image.jpg` |
| Icon | `/assets/images/icons/your-icon.png` |
| General | `/assets/images/general/your-image.jpg` |

## ⚠️ Important Notes

- ✅ **Do use** absolute paths starting with `/` (e.g., `/assets/images/...`)
- ❌ **Don't use** relative paths like `../assets/...`
- ✅ Images in `public/` folder are directly accessible
- ✅ No import needed for images in `public/`
- ✅ Image paths will work in both development and production

## 📝 Default Placeholder Images

Create these placeholders for fallback:
- `/assets/images/temples/default-temple.jpg`
- `/assets/images/bhaktnivas/default-room.jpg`
- `/assets/images/general/default-image.jpg`

These will show when no specific image is available.

---

**Your images are now ready to use in TirthSeva!** 🎨
