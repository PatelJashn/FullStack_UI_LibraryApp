// Component Analyzer - Determines the appropriate box size for UI components
export class ComponentAnalyzer {
  static analyzeComponent(component) {
    const analysis = {
      complexity: this.calculateComplexity(component),
      contentLength: this.calculateContentLength(component),
      elementCount: this.countElements(component),
      hasFormElements: this.hasFormElements(component),
      hasMultipleSections: this.hasMultipleSections(component),
      recommendedSize: 'original' // default
    };

    // Determine recommended size based on analysis
    analysis.recommendedSize = this.determineSize(analysis);
    
    return analysis;
  }

  static calculateComplexity(component) {
    let complexity = 0;
    const html = component.code?.html || '';
    
    // Count different types of elements
    const elements = {
      buttons: (html.match(/<button/g) || []).length,
      inputs: (html.match(/<input/g) || []).length,
      selects: (html.match(/<select/g) || []).length,
      textareas: (html.match(/<textarea/g) || []).length,
      divs: (html.match(/<div/g) || []).length,
      forms: (html.match(/<form/g) || []).length,
      tables: (html.match(/<table/g) || []).length,
      lists: (html.match(/<(ul|ol)/g) || []).length,
      images: (html.match(/<img/g) || []).length,
      icons: (html.match(/<(svg|i)/g) || []).length
    };

    // Calculate complexity score
    complexity += elements.buttons * 1;
    complexity += elements.inputs * 2;
    complexity += elements.selects * 3;
    complexity += elements.textareas * 4;
    complexity += elements.divs * 0.5;
    complexity += elements.forms * 5;
    complexity += elements.tables * 6;
    complexity += elements.lists * 2;
    complexity += elements.images * 1;
    complexity += elements.icons * 0.5;

    return complexity;
  }

  static calculateContentLength(component) {
    const html = component.code?.html || '';
    const css = component.code?.css || '';
    const js = component.code?.js || '';
    
    return {
      htmlLength: html.length,
      cssLength: css.length,
      jsLength: js.length,
      totalLength: html.length + css.length + js.length
    };
  }

  static countElements(component) {
    const html = component.code?.html || '';
    const tagMatches = html.match(/<[^>]+>/g) || [];
    return tagMatches.length;
  }

  static hasFormElements(component) {
    const html = component.code?.html || '';
    const formElements = ['input', 'select', 'textarea', 'button', 'form'];
    return formElements.some(element => html.includes(`<${element}`));
  }

  static hasMultipleSections(component) {
    const html = component.code?.html || '';
    const sectionIndicators = [
      /<section/g,
      /<header/g,
      /<footer/g,
      /<main/g,
      /<aside/g,
      /<nav/g,
      /class="[^"]*(section|header|footer|main|aside|nav)[^"]*"/g
    ];
    
    return sectionIndicators.some(regex => regex.test(html));
  }

  static determineSize(analysis) {
    // Priority rules for size determination
    
    // 1. Forms always get big size
    if (analysis.hasFormElements && analysis.complexity > 8) {
      return 'big';
    }
    
    // 2. High complexity components (tables, complex layouts)
    if (analysis.complexity > 15) {
      return 'big';
    }
    
    // 3. Components with multiple sections or long content
    if (analysis.hasMultipleSections || analysis.contentLength.totalLength > 2000) {
      return 'long';
    }
    
    // 4. Medium complexity components
    if (analysis.complexity > 8 || analysis.elementCount > 15) {
      return 'long';
    }
    
    // 5. Simple components
    return 'original';
  }

  static getSizeDescription(size) {
    const descriptions = {
      original: 'Standard size - Perfect for buttons, cards, and simple components',
      big: 'Large size - Ideal for forms, complex layouts, and detailed components',
      long: 'Wide size - Great for navigation bars, headers, and horizontal layouts'
    };
    return descriptions[size] || descriptions.original;
  }

  static getSizeDimensions(size) {
    const dimensions = {
      original: { width: '100%', height: 'auto', minHeight: '200px' },
      big: { width: '100%', height: 'auto', minHeight: '400px' },
      long: { width: '100%', height: 'auto', minHeight: '150px' }
    };
    return dimensions[size] || dimensions.original;
  }
}

// Component categorization based on type
export const ComponentCategories = {
  SIMPLE: ['Buttons', 'Icons', 'Badges', 'Avatars'],
  MEDIUM: ['Cards', 'Alerts', 'Modals', 'Tooltips'],
  COMPLEX: ['Forms', 'Tables', 'Navigation', 'Dashboards'],
  LAYOUT: ['Headers', 'Footers', 'Sidebars', 'Grids']
};

// Smart categorization function
export function categorizeComponent(component) {
  const category = component.category || 'All';
  const analysis = ComponentAnalyzer.analyzeComponent(component);
  
  // Override based on category
  if (ComponentCategories.SIMPLE.includes(category)) {
    return 'original';
  }
  
  if (ComponentCategories.COMPLEX.includes(category)) {
    return 'big';
  }
  
  if (ComponentCategories.LAYOUT.includes(category)) {
    return 'long';
  }
  
  // Use analysis result
  return analysis.recommendedSize;
}
